import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const TOKEN_EXPIRATION_TIME = 5 * 60 * 60 * 1000; // 5 hours in milliseconds


// Async thunk action to handle login
export const loginAsync = createAsyncThunk(
  'login/loginAsync',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/signin`, credentials);
      console.log("Login API response:", response.data);
      const { token, is_admin } = response.data;
      // Format the token with Bearer prefix before storing
      const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      console.log("Storing formatted token:", formattedToken);
      localStorage.setItem("jwt", formattedToken);
      localStorage.setItem("is_admin", is_admin);
      localStorage.setItem("jwtExpiration", new Date().getTime() + TOKEN_EXPIRATION_TIME);
      localStorage.setItem("user",response.data.user.username)
      
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk action to handle doctor login
export const doctorloginAsync = createAsyncThunk(
  'login/doctorloginAsync',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/doctor/signin`, credentials);
      console.log(response)
      
      if (response.data.token !== undefined) {
        const expirationTime = new Date().getTime() + TOKEN_EXPIRATION_TIME;
        localStorage.setItem("doctortoken", response.data.token);
        localStorage.setItem("is_doctor", true);
        localStorage.setItem("doctortokenExpiration", expirationTime);
        localStorage.setItem("doctor", response.data.user.name);
      }
      
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Check if the token has expired
const isTokenExpired = () => {
  const currentTime = new Date().getTime();
  const storedExpirationTime = localStorage.getItem("jwtExpiration");
  return storedExpirationTime && currentTime > storedExpirationTime;
};

// Check if doctor token has expired
const isDoctorTokenExpired = () => {
  const currentTime = new Date().getTime();
  const storedExpirationTime = localStorage.getItem("doctortokenExpiration");
  return storedExpirationTime && currentTime > storedExpirationTime;
};

// Create the login slice
const loginSlice = createSlice({
  name: 'login',
  initialState: {
    
    isLoading: false,
    error: null,
    user: null,
    doctor: null
  },
  reducers: {
    logout:()=>{
     localStorage.clear()
    }
  },
  extraReducers: {
    [loginAsync.pending]: (state) => {
      state.isLoading = true;
    },
    [loginAsync.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    [loginAsync.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [doctorloginAsync.pending]: (state) => {
      state.isLoading = true;
    },
    [doctorloginAsync.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.doctor = action.payload;
    },
    [doctorloginAsync.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

// Handle token expiration check on login slice initialization
if (isTokenExpired()) {
  localStorage.removeItem("jwt");
  localStorage.removeItem("jwtExpiration");
  localStorage.removeItem("is_admin");
}

// Handle doctor token expiration check
if (isDoctorTokenExpired()) {
  localStorage.removeItem("doctortoken");
  localStorage.removeItem("doctortokenExpiration");
  localStorage.removeItem("is_doctor");
}


// Export the async thunk action and the login slice reducer
export default loginSlice.reducer;
export const {logout} = loginSlice.actions;


