import { Grid, Button, Typography, Box, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress, Chip } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/doctor/doctor-patient",
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleApprove = (appointmentId) => {
    let config = {
      method: "put",
      url: `http://localhost:5000/doctor/approve-appointment/${appointmentId}`,
      withCredentials: true,
      data: {
        isApproved: true,
        approvedDate: new Date(),
        status: "approved"
      }
    };

    axios
      .request(config)
      .then((response) => {
        // Update the local state
        const updatedUsers = users.map(user => {
          if (user._id === appointmentId) {
            return { ...user, isApproved: true, status: "approved" };
          }
          return user;
        });
        setUsers(updatedUsers);
        setSnackbar({
          open: true,
          message: "Appointment approved successfully!",
          severity: "success"
        });
        setOpenDialog(false);
      })
      .catch((error) => {
        console.log(error);
        setSnackbar({
          open: true,
          message: "Failed to approve appointment",
          severity: "error"
        });
      });
  };

  const handleReject = (appointmentId) => {
    let config = {
      method: "put",
      url: `http://localhost:5000/doctor/reject-appointment/${appointmentId}`,
      withCredentials: true,
      data: {
        isApproved: false,
        status: "rejected"
      }
    };

    axios
      .request(config)
      .then((response) => {
        // Update the local state
        const updatedUsers = users.map(user => {
          if (user._id === appointmentId) {
            return { ...user, isApproved: false, status: "rejected" };
          }
          return user;
        });
        setUsers(updatedUsers);
        setSnackbar({
          open: true,
          message: "Appointment rejected",
          severity: "info"
        });
        setOpenDialog(false);
      })
      .catch((error) => {
        console.log(error);
        setSnackbar({
          open: true,
          message: "Failed to reject appointment",
          severity: "error"
        });
      });
  };

  const handleOpenDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusChip = (status, isApproved) => {
    if (status === "approved" || isApproved) {
      return <Chip icon={<CheckCircleIcon />} label="Approved" color="success" size="small" />;
    } else if (status === "rejected") {
      return <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />;
    } else {
      return <Chip icon={<AccessTimeIcon />} label="Pending" color="warning" size="small" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>Patient Appointments Management</Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <table width="100%" border={1} style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Disease</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.user?.username || "N/A"}</td>
                  <td>{new Date(user.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td>{user.disease}</td>
                  <td>
                    {getStatusChip(user.status, user.isApproved)}
                  </td>
                  <td>
                    <span
                      style={{
                        backgroundColor: user.payment === "paid" ? "#4caf50" : "#f44336",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-block"
                      }}
                    >
                      {user.payment}
        </span>
                  </td>
                  <td>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ mr: 1 }}
                      href={`/report/${user._id}`}
                    >
                      Report
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDialog(user)}
                    >
                      Manage
          </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Grid>

      {/* Appointment Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedAppointment && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                Appointment Details
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 2, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Patient Information
                      </Typography>
                      <Typography><strong>Name:</strong> {selectedAppointment.user?.username || "N/A"}</Typography>
                      <Typography><strong>Email:</strong> {selectedAppointment.user?.email || "N/A"}</Typography>
                      <Typography><strong>Gender:</strong> {selectedAppointment.user?.gender || "N/A"}</Typography>
                      <Typography><strong>Age:</strong> {selectedAppointment.user?.age || "N/A"}</Typography>
                      <Typography><strong>Phone:</strong> {selectedAppointment.user?.phone || "N/A"}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 2, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Appointment Details
                      </Typography>
                      <Typography><strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</Typography>
                      <Typography><strong>Disease:</strong> {selectedAppointment.disease}</Typography>
                      <Typography><strong>Status:</strong> {selectedAppointment.status}</Typography>
                      <Typography><strong>Invoice Amount:</strong> ₹{selectedAppointment.invoice}</Typography>
                      <Typography><strong>Payment:</strong> {selectedAppointment.payment}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {selectedAppointment.about && (
                  <Grid item xs={12}>
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          Patient Description
                        </Typography>
                        <Typography paragraph>{selectedAppointment.about}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="inherit">
                Close
              </Button>
              {!selectedAppointment.isApproved && selectedAppointment.status !== "rejected" && (
                <>
                  <Button 
                    onClick={() => handleReject(selectedAppointment._id)} 
                    color="error" 
                    variant="contained"
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApprove(selectedAppointment._id)} 
                    color="success" 
                    variant="contained"
                  >
                    Approve
                  </Button>
                </>
              )}
              {selectedAppointment.isApproved && (
                <Button 
                  variant="contained" 
                  color="primary"
                  href={`/report/${selectedAppointment._id}`}
                >
                  Create Prescription
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default Users;







