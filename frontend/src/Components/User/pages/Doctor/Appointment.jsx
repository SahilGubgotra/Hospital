import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsAuthenticated(true);
      fetchAppointments(token);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const fetchAppointments = async (token) => {
    try {
      console.log("Fetching appointments...");
      
      // Ensure token has Bearer prefix as required by backend
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      console.log("Using token:", authToken); // Log token for debugging
      
      const response = await axios.get(
        "http://localhost:8080/patient",
        {
          headers: {
            authorization: authToken,
          },
        }
      );

      console.log("Appointments response:", response.data);
      
      // Check for the correct response format based on the backend
      if (response.data && response.data.user_appointments) {
        setAppointments(response.data.user_appointments);
        toast.success("Appointments loaded successfully");
      } else {
        setError("Could not load appointments");
        toast.error("Error loading appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        setError(error.response.data?.message || "Failed to load appointments");
        toast.error(error.response.data?.message || "Failed to load appointments");
      } else {
        setError("Error connecting to server");
        toast.error("Error connecting to server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFA500"; // Orange
      case "Approved":
        return "#4CAF50"; // Green
      case "Rejected":
        return "#F44336"; // Red
      default:
        return "#757575"; // Grey
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Invalid date";
      const date = new Date(dateString);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  // If user is not authenticated
  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Authentication Required
          </Typography>
          <Typography variant="body1" paragraph>
            You need to be logged in to view your appointments.
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
      <Container
        maxWidth="md"
        sx={{ py: 8, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          My Appointments
        </Typography>
        <Divider />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {appointments.length === 0 ? (
        <Paper
          elevation={3}
          sx={{ p: 4, textAlign: "center", borderRadius: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            No appointments found
          </Typography>
          <Typography variant="body1" paragraph>
            You haven't booked any appointments yet.
          </Typography>
          <Button
            component={Link}
            to="/doctor"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Book an Appointment
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 2,
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" component="h2" gutterBottom>
                      {appointment.doctor && appointment.doctor.name
                        ? appointment.doctor.name
                        : "Doctor information not available"}
                    </Typography>
                    <Chip
                      label={
                        appointment.approved ? "Approved" : "Pending Approval"
                      }
                      sx={{
                        bgcolor: getStatusColor(
                          appointment.approved ? "Approved" : "Pending"
                        ),
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Appointment Date:
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(appointment.date)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Medical Condition:
                    </Typography>
                    <Typography variant="body1">
                      {appointment.disease}
                    </Typography>
                  </Box>

                  {appointment.doctor && appointment.doctor.expertise && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "text.secondary" }}
                      >
                        Doctor Specialization:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {appointment.doctor.expertise.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            size="small"
                            sx={{
                              bgcolor: "primary.light",
                              color: "white",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Payment Status:
                    </Typography>
                    <Chip
                      label={appointment.payment ? "Paid" : "Unpaid"}
                      size="small"
                      sx={{
                        bgcolor: appointment.payment ? "#4CAF50" : "#FFA500",
                        color: "white",
                        fontWeight: "bold",
                        mt: 1,
                      }}
                    />
                  </Box>

                  {!appointment.approved && !appointment.payment && (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        Your appointment is pending approval from the doctor.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AppointmentPage;
