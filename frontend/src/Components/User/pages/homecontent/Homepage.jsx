import React from "react";
import Screen from "./Slider";
import { 
  Avatar, 
  Grid, 
  Typography, 
  useTheme, 
  Container, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box,
  Paper 
} from "@mui/material";
import Departments from "./Departments";
import h1_hero from '../../assets/h1_hero.png';
import Image from 'mui-image';
import Gallery from "./Gallery";
import { Link } from 'react-router-dom';

const Homepage = () => {
  const theme = useTheme();

  const departments = [
    { name: "Anesthesiology And Critical Care" },
    { name: "Clinical Biochemistry" },
    { name: "Department of Dermatology" },
    { name: "Microbiology" },
    { name: "Ophthalmology" },
  ];

  const features = [
    {
      title: "Expert Doctors",
      description: "Our team of highly qualified doctors provide exceptional care with expertise across all medical domains.",
      icon: "👨‍⚕️",
    },
    {
      title: "Advanced Technology",
      description: "We utilize cutting-edge medical technology and equipment to ensure accurate diagnosis and effective treatments.",
      icon: "🔬",
    },
    {
      title: "24/7 Emergency Care",
      description: "Our emergency department is staffed round-the-clock to provide immediate care when you need it most.",
      icon: "🏥",
    },
    {
      title: "Online Consultations",
      description: "Connect with our doctors from the comfort of your home through our secure telehealth services.",
      icon: "💻",
    },
    {
      title: "Specialized Treatments",
      description: "We offer specialized treatment programs tailored to address specific health conditions and needs.",
      icon: "💊",
    },
    {
      title: "Holistic Care Approach",
      description: "Our healthcare approach focuses on treating the whole person, not just the symptoms of illness.",
      icon: "🧘‍♀️",
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      quote: "The doctors and staff at this hospital provided exceptional care during my treatment. Their professionalism and compassion made a difficult time much easier to handle.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      name: "Michael Chen",
      role: "Patient",
      quote: "I've been impressed with the quality of care and the advanced facilities at this hospital. The doctors take time to listen and provide thorough explanations.",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg"
    },
    {
      name: "Priya Patel",
      role: "Patient's Family Member",
      quote: "The care my father received at this hospital was outstanding. The staff kept us informed every step of the way and treated him with dignity and respect.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <Grid container spacing={0}>
        <Grid item xs={12} sx={{ marginBottom: "30px" }}>
          <Screen />
        </Grid>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
              Our Healthcare Services
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              We offer a wide range of services to meet your healthcare needs with state-of-the-art facilities and expert medical staff.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.2)'
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>{feature.icon}</Typography>
                    <Typography gutterBottom variant="h5" component="h3" fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={4}>
            <Button 
              component={Link} 
              to="/services" 
              variant="contained" 
              size="large" 
              color="primary"
              sx={{ 
                borderRadius: '50px', 
                px: 4, 
                py: 1.5, 
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              View All Services
            </Button>
          </Box>
        </Container>

        {/* Doctor Section */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
              Meet Our Doctors
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Our team of experienced doctors are dedicated to providing the highest quality care for all your healthcare needs.
            </Typography>
          </Box>

          <Box textAlign="center" mt={4}>
            <Button 
              component={Link} 
              to="/doctor" 
              variant="contained" 
              size="large" 
              color="primary"
              sx={{ 
                borderRadius: '50px', 
                px: 4, 
                py: 1.5, 
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Meet Our Doctors
            </Button>
          </Box>
        </Container>

        {/* Testimonials */}
        <Box sx={{ py: 8, backgroundColor: '#f5f9fd' }}>
          <Container maxWidth="lg">
            <Typography variant="h3" component="h2" fontWeight="bold" textAlign="center" gutterBottom>
              Patient Testimonials
            </Typography>
            
            <Grid container spacing={4} sx={{ mt: 2 }}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 4 }}>
                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                      "{testimonial.quote}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={testimonial.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">{testimonial.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{testimonial.role}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Gallery Section */}
        <Grid item xs={12} sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h3" component="h2" textAlign="center" fontWeight="bold" gutterBottom>
            Medical Gallery
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
            Take a visual tour of our state-of-the-art facilities and healthcare services
          </Typography>
          <Gallery />
        </Grid>
      </Grid>
    </>
  );
};

export default Homepage;
