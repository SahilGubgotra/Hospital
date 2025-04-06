import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  Alert,
  Paper,
  Container,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Box } from "@mui/system";
import axios from "axios";
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./Form.css";

const AppointmentForm = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Check for authentication token
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch doctor details
  const fetchDoctorDetails = async (doctorId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const config = token ? { headers: { authorization: token } } : {};
      
      console.log("Fetching doctor with ID:", doctorId);
      const response = await axios.get(`http://localhost:8080/public/doctor/${doctorId}`, config);
      
      if (response.data && response.data.data) {
        setDoctor(response.data.data);
        console.log("Doctor data loaded:", response.data.data);
        toast.success(response.data.message || "Doctor details loaded successfully");
      } else {
        setError("Could not load doctor details");
        toast.error("Error loading doctor information");
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      setError(error.message || "Failed to load doctor details");
      toast.error(error.message || "An error occurred while loading doctor information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDoctorDetails(id);
    }
  }, [id]);

  // Handle form data
  const [disease, setDisease] = useState("");
  const [dateString, setDateString] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
    
    if (date) {
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      setDateString(formattedDate);
    } else {
      setDateString("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!disease || !dateString) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      // Ensure token has Bearer prefix as required by backend auth middleware
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      
      // Create payload exactly as expected by backend
      // Based on backend code, these are the exact fields expected
      const payload = {
        doctor: id,  // The doctor ID from the URL params
        disease,     // The medical condition
        date: dateString  // The date string in YYYY-MM-DD format
      };

      console.log("Sending appointment payload:", payload);
      console.log("Using token:", authToken);
      
      try {
        const response = await axios({
          method: 'post',
          url: 'http://localhost:8080/patient/appointment',
          data: payload,
          headers: {
            authorization: authToken
          }
        });
        
        console.log("Appointment response:", response.data);
        
        toast.success("Appointment booked successfully!");
        setDisease("");
        setDateString("");
        setSelectedDate(null);
        
        // Redirect to appointments page
        setTimeout(() => {
          navigate("/appointment");
        }, 2000);
      } catch (error) {
        console.error("Appointment booking error:", error);
        
        if (error.response) {
          console.error("Error response status:", error.response.status);
          console.error("Error response data:", error.response.data);
          console.error("Error response headers:", error.response.headers);
          console.error("Request that was sent:", {
            url: 'http://localhost:8080/patient/appointment',
            method: 'POST',
            data: payload,
            headers: { authorization: authToken }
          });
          
          // Try to extract the most helpful error message
          let errorMessage = "Failed to book appointment";
          if (error.response.data && typeof error.response.data === 'object') {
            errorMessage = error.response.data.message || errorMessage;
            // Log each property of the error response for debugging
            Object.keys(error.response.data).forEach(key => {
              console.error(`Response data[${key}]:`, error.response.data[key]);
            });
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          }
          
          toast.error(errorMessage);
        } else if (error.request) {
          console.error("No response received:", error.request);
          toast.error("Cannot connect to server. Please check if the backend is running.");
        } else {
          console.error("Error during request setup:", error.message);
          toast.error("An error occurred while booking the appointment");
        }
      }
    } catch (outerError) {
      console.error("Outer error:", outerError);
      toast.error("An unexpected error occurred");
    }
  };

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Authentication Required</Typography>
          <Typography variant="body1" paragraph>
            You need to be logged in to book an appointment.
          </Typography>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            Login to Continue
          </Button>
        </Paper>
      </Container>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Loading doctor information...</Typography>
      </Container>
    );
  }

  // Show error state
  if (error || !doctor) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Could not load doctor details. Please try again later."}
        </Alert>
        <Button 
          component={Link} 
          to="/doctor" 
          variant="contained" 
          color="primary"
        >
          Back to Doctors
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Doctor Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom>
                {doctor.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>

            <Box 
              sx={{
                width: "100%",
                height: { xs: "300px", md: "400px" },
                borderRadius: "8px",
                overflow: "hidden",
                mb: 3,
              }}
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>

            <Typography variant="body1" paragraph>
              {doctor.desc || `${doctor.name} is a specialized healthcare professional with expertise in various medical fields.`}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Expertise
              </Typography>
              <List
                sx={{
                  listStyleType: "disc",
                  pl: 2,
                  "& .MuiListItem-root": {
                    display: "list-item",
                  },
                }}
              >
                {doctor.expertise && doctor.expertise.map((item, index) => (
                  <ListItem key={index}>{item}</ListItem>
                ))}
              </List>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Available Time
              </Typography>
              <List
                sx={{
                  listStyleType: "disc",
                  pl: 2,
                  "& .MuiListItem-root": {
                    display: "list-item",
                  },
                }}
              >
                {doctor.date && doctor.date.map((item, index) => (
                  <ListItem key={index}>{item}</ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Typography variant="body1">Email: {doctor.email}</Typography>
              <Typography variant="body1">Phone: {doctor.contact || "Not provided"}</Typography>
              <Typography variant="body1">Consultation Fee: ${doctor.ammount || "Varies"}</Typography>
            </Box>
          </Grid>

          {/* Appointment Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "primary.main",
                  textAlign: "center",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  mb: 4,
                }}
              >
                Book Appointment
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Medical Condition/Disease"
                      name="disease"
                      value={disease}
                      onChange={(e) => setDisease(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      Select Appointment Date:
                    </Typography>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                      placeholderText="Select a date"
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{ mt: 2, py: 1.5 }}
                    >
                      Book Appointment
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AppointmentForm;

