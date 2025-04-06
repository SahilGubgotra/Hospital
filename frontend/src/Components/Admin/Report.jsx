import { Button, Grid, Card, CardContent, Typography, Box, CircularProgress, Divider } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Report() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidAppointments: 0,
    unpaidAppointments: 0,
    totalAppointments: 0,
    revenueByMonth: {}
  });

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/admin/appointment",
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setPatients(response.data);
        calculateStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const calculateStats = (appointmentData) => {
    let totalRevenue = 0;
    let paidCount = 0;
    let unpaidCount = 0;
    const monthlyRevenue = {};

    appointmentData.forEach(appointment => {
      if (appointment.payment === 'paid') {
        paidCount++;
        totalRevenue += parseInt(appointment.invoice || 0);
        
        // Track monthly revenue
        const month = new Date(appointment.date).toLocaleString('default', { month: 'long' });
        if (!monthlyRevenue[month]) {
          monthlyRevenue[month] = 0;
        }
        monthlyRevenue[month] += parseInt(appointment.invoice || 0);
      } else {
        unpaidCount++;
      }
    });

    setStats({
      totalRevenue,
      paidAppointments: paidCount,
      unpaidAppointments: unpaidCount,
      totalAppointments: appointmentData.length,
      revenueByMonth: monthlyRevenue
    });
  };

  const pieChartData = {
    labels: ['Paid', 'Unpaid'],
    datasets: [
      {
        label: 'Appointments',
        data: [stats.paidAppointments, stats.unpaidAppointments],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(stats.revenueByMonth),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: Object.values(stats.revenueByMonth),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
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
        <Typography variant="h4" gutterBottom>
          Financial Dashboard
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </Grid>

      {/* Financial Summary Cards */}
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%', backgroundColor: '#e3f2fd' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h4">₹{stats.totalRevenue}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%', backgroundColor: '#e8f5e9' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Paid Appointments
            </Typography>
            <Typography variant="h4">{stats.paidAppointments}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%', backgroundColor: '#ffebee' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Unpaid Appointments
            </Typography>
            <Typography variant="h4">{stats.unpaidAppointments}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%', backgroundColor: '#ede7f6' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Rate
            </Typography>
            <Typography variant="h4">
              {stats.totalAppointments ? Math.round((stats.paidAppointments / stats.totalAppointments) * 100) : 0}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Status Distribution
            </Typography>
            <Box height={300} display="flex" justifyContent="center">
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue
            </Typography>
            <Box height={300}>
              <Bar 
                data={barChartData} 
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Revenue (₹)'
                      }
                    }
                  }
                }} 
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Detailed Appointments */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Appointments
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table width="100%" border={1} style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Doctor</th>
                    <th>Disease</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => {
                    if (index < 5) {
                      return (
                        <tr key={index}>
                          <td>{patient.user.username}</td>
                          <td>{patient.doctor.name}</td>
                          <td>{patient.disease}</td>
                          <td>{new Date(patient.date).toLocaleDateString()}</td>
                          <td>₹{patient.invoice}</td>
                          <td>
                            <span
                              style={{
                                backgroundColor: patient.payment === "paid" ? "#4caf50" : "#f44336",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                display: "inline-block"
                              }}
                            >
                              {patient.payment}
                            </span>
                          </td>
                          <td>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              href={`/report/${patient._id}`}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Report; 