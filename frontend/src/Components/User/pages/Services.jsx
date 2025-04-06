import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Modal,
  Typography,
  Alert,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { getservice } from "../slices/getService";
import Loading from "../Loading";
import Image from "mui-image";

const ServiceItem = ({ image, title, description, features }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card onClick={handleOpen} sx={{
        height:"400px",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }
      }}>
        <CardMedia component="img" height="200" image={image} alt={title} />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Image src={image} />
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1">{description}</Typography>
          <Typography variant="h6" gutterBottom>
            Features:
          </Typography>
          <ul>
            {features && features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </Box>
      </Modal>
    </>
  );
};

const OurServicesPage = () => {
  const dispatch = useDispatch();
  const datas = useSelector((state) => state.service);
  const { service, isLoading, error } = datas;
  const [loadingError, setLoadingError] = useState(false);

  // Default services to display if API fails
  const defaultServices = [
    {
      image: "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg",
      title: "General Checkup",
      description: "Comprehensive health assessment including vital signs, medical history review, and physical examination.",
      features: ["Complete physical examination", "Health risk assessment", "Preventive health counseling"]
    },
    {
      image: "https://img.freepik.com/free-photo/young-handsome-physician-medical-robe-with-stethoscope_1303-17818.jpg",
      title: "Specialist Consultation",
      description: "Expert consultation with specialists in various medical fields including cardiology, neurology, and more.",
      features: ["One-on-one specialist consultation", "Detailed diagnosis", "Treatment planning"]
    },
    {
      image: "https://img.freepik.com/free-photo/medical-banner-with-doctor-working-laptop_23-2149611137.jpg",
      title: "Diagnostic Services",
      description: "Advanced diagnostic tests including blood work, imaging, and specialized screenings.",
      features: ["Laboratory testing", "Medical imaging", "Cardiac diagnostics"]
    },
    {
      image: "https://img.freepik.com/free-photo/ambulance-paramedic-emergency-medical-care_342744-1302.jpg",
      title: "Emergency Care",
      description: "24/7 emergency medical services for critical conditions requiring immediate attention.",
      features: ["Immediate medical attention", "Critical care", "Emergency surgical procedures"]
    },
    {
      image: "https://img.freepik.com/free-photo/shot-scientist-using-medical-tools-lab_482257-1757.jpg",
      title: "Preventive Health",
      description: "Preventive health services including vaccinations, screenings, and health education.",
      features: ["Immunizations", "Cancer screenings", "Lifestyle modification counseling"]
    },
    {
      image: "https://img.freepik.com/free-photo/closeup-medical-ambulance-standing-outdoors_637285-2525.jpg",
      title: "Telehealth Services",
      description: "Virtual consultations with healthcare professionals from the comfort of your home.",
      features: ["Video consultations", "Online prescription renewal", "Remote monitoring"]
    },
    {
      image: "https://img.freepik.com/free-photo/medical-workers-doing-patient-examination_23-2149033373.jpg",
      title: "Women's Health",
      description: "Specialized care addressing women's unique health needs across all life stages.",
      features: ["Obstetrics and gynecology", "Breast health", "Hormonal health management"]
    },
    {
      image: "https://img.freepik.com/free-photo/doctor-checking-patient-blood-pressure_23-2148613936.jpg", 
      title: "Chronic Disease Management",
      description: "Comprehensive care and monitoring for chronic conditions like diabetes, hypertension, and COPD.",
      features: ["Personalized treatment plans", "Regular monitoring", "Lifestyle management support"]
    }
  ];

  const [services, setServices] = useState([]);

  useEffect(() => {
    dispatch(getservice());
  }, [dispatch]);

  // Set services when API data is loaded or use defaults
  useEffect(() => {
    if (service?.user_service && service.user_service.length > 0) {
      setServices(service.user_service);
      setLoadingError(false);
    } else {
      setServices(defaultServices);
      if (error) {
        setLoadingError(true);
      }
    }
  }, [service, error]);

  return (
    <>
      <Loading isloading={isLoading} />
      <Box py={4}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
            Our Services
          </Typography>

          {loadingError && (
            <Alert severity="info" sx={{ mb: 3 }}>
              We're experiencing technical difficulties. Showing our default service offerings.
            </Alert>
          )}

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ServiceItem
                  image={service.image}
                  title={service.title}
                  description={service.description}
                  features={service.features || []}
                  price={service.price}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default OurServicesPage;
