import React from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Error display component to render error messages as strings
const ErrorDisplay = ({ children }) => {
  return <div className="error-message" style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px' }}>{children}</div>;
};

const theme = createTheme();

function SignUpForm() {
  const Navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    age: "",
    gender: "",
  };

  const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string()
      .min(6, "Password should be at least 6 characters long")
      .required("Password is required"),
    confirmPassword: yup.string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    phone: yup.string().required("Phone number is required"),
    address: yup.string().required("Address is required"),
    age: yup.number().required("Age is required").positive("Age must be positive"),
    gender: yup.string().required("Gender is required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log("Submitting form values:", values);
      
      // Define the API URL using environment variable with fallback
      const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/signup`;
      console.log("Sending request to:", API_URL);
      
      // Add request headers 
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      const response = await axios.post(API_URL, values, config);

      console.log("Signup response:", response);
      
      if (response.status === 200 && response.data.token) {
        // Ensure token has Bearer prefix
        const tokenWithBearer = response.data.token.startsWith("Bearer ") 
          ? response.data.token 
          : `Bearer ${response.data.token}`;
        
        localStorage.setItem("jwt", tokenWithBearer);
        console.log("Registration token stored with Bearer prefix:", tokenWithBearer);
        
        toast.success("Registration successful!");
        Navigate("/");
      } else {
        toast.success("Signup successful! Please login.");
        Navigate("/login");
      }
      
      resetForm();
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Registration failed";
      
      // Detailed error logging
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        
        if (error.response.data && typeof error.response.data === 'object') {
          errorMessage = error.response.data.message || errorMessage;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMessage = "No response from server. Backend may not be running.";
      } else {
        console.error("Error setting up request:", error.message);
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <Field
                      as={TextField}
                      type="text"
                      label="Username"
                      variant="outlined"
                      name="username"
                      fullWidth
                    />
                    <Box sx={{ color: "red" }}>
                      <ErrorMessage name="username" component={ErrorDisplay} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      type="email"
                      label="Email"
                      variant="outlined"
                      name="email"
                      fullWidth
                    />
                    <Box sx={{ color: "red" }}>
                      <ErrorMessage name="email" component={ErrorDisplay} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      type="password"
                      label="Password"
                      variant="outlined"
                      name="password"
                      fullWidth
                    />
                    <Box sx={{ color: "red" }}>
                      <ErrorMessage name="password" component={ErrorDisplay} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      type="password"
                      label="Confirm Password"
                      variant="outlined"
                      name="confirmPassword"
                      fullWidth
                    />
                    <Box sx={{ color: "red" }}>
                      <ErrorMessage name="confirmPassword" component={ErrorDisplay} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      type="text"
                      label="Phone"
                      variant="outlined"
                      name="phone"
                      fullWidth
                    />
                    <Box sx={{ color: "red" }}>
                      <ErrorMessage name="phone" component={ErrorDisplay} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      type="text"
                      label="Address"
                      variant="outlined"
                      name="address"
                      fullWidth
                    />
                    <Box sx={{ color: "red" }}>
                      <ErrorMessage name="address" component={ErrorDisplay} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      type="text"
                      label="Age"
                      variant="outlined"
                      name="age"
                      fullWidth
                    />
                    <Box sx={{ color: "red" }}>
                      <ErrorMessage name="age" component={ErrorDisplay} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Field type="radio" name="gender" value="male" />}
                      label="Male"
                    />
                    <FormControlLabel
                      control={<Field type="radio" name="gender" value="female" />}
                      label="Female"
                    />
                    <FormControlLabel
                      control={<Field type="radio" name="gender" value="other" />}
                      label="Other"
                    />
                    <Box sx={{ color: "red" }}>
                      <ErrorMessage name="gender" component={ErrorDisplay} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      disabled={isSubmitting}
                    >
                      Sign Up
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUpForm;







