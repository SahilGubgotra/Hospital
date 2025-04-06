import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import DoctorCard from "./Doctorcard";
import { Grid, Typography, Alert, Box, Container } from "@mui/material";
import Loading from "../../Loading";
import { getdoctor } from "../../slices/getDoctor";
import { useDispatch, useSelector } from "react-redux";

const Doctor = () => {
  const dispatch = useDispatch();
  const datas = useSelector((state) => state.doctor);
  const { doctor, isLoading, error } = datas;
  const [loadingError, setLoadingError] = useState(false);

  // Default doctors to display if API fails
  const defaultDoctors = [
    {
      _id: "doctor1",
      name: "Dr. Sarah Johnson",
      expertise: ["Cardiology", "Internal Medicine", "Preventive Care"],
      image: "https://img.freepik.com/free-photo/portrait-smiling-female-doctor-standing-with-arms-crossed-white-coat-stethoscope_1262-12684.jpg",
      desc: "Board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases and promoting heart health."
    },
    {
      _id: "doctor2",
      name: "Dr. Michael Chen",
      expertise: ["Neurology", "Neurosurgery", "Pain Management"],
      image: "https://img.freepik.com/free-photo/portrait-doctor_144627-39390.jpg",
      desc: "Specialized neurologist focused on diagnosing and treating complex neurological disorders using the latest treatment protocols."
    },
    {
      _id: "doctor3",
      name: "Dr. Priya Patel",
      expertise: ["Pediatrics", "Neonatology", "Child Development"],
      image: "https://img.freepik.com/free-photo/indian-female-doctor_157027-513.jpg",
      desc: "Dedicated pediatrician who believes in providing compassionate care to children of all ages, from infants to adolescents."
    },
    {
      _id: "doctor4",
      name: "Dr. James Wilson",
      expertise: ["Orthopedics", "Sports Medicine", "Rehabilitation"],
      image: "https://img.freepik.com/free-photo/handsome-young-male-doctor-with-stethoscope-standing-against-blue-background_662251-333.jpg",
      desc: "Orthopedic surgeon specializing in sports injuries and joint replacements, helping patients regain mobility and quality of life."
    },
    {
      _id: "doctor5",
      name: "Dr. Lisa Rodriguez",
      expertise: ["Obstetrics", "Gynecology", "Women's Health"],
      image: "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg",
      desc: "OB/GYN specialist providing comprehensive care for women at all stages of life, with a focus on reproductive health."
    },
    {
      _id: "doctor6",
      name: "Dr. Robert Kim",
      expertise: ["Dermatology", "Cosmetic Procedures", "Skin Cancer"],
      image: "https://img.freepik.com/free-photo/hospital-healthcare-workers-covid-19-treatment-concept-young-doctor-scrubs-making-daily-errands-clinic-listening-patient-symptoms-professional-physician-working-examination-diagnostics-clinic_1258-57233.jpg",
      desc: "Board-certified dermatologist specializing in medical and cosmetic dermatology, committed to helping patients achieve healthy skin."
    },
    {
      _id: "doctor7",
      name: "Dr. Emily Thompson",
      expertise: ["Psychiatry", "Behavioral Health", "Therapy"],
      image: "https://img.freepik.com/free-photo/portrait-smiling-young-woman-doctor-healthcare-medical-worker-pointing-fingers-left-showing-clinic-banner-standing-white-wall_1258-88108.jpg",
      desc: "Compassionate psychiatrist dedicated to mental health treatment and advocacy, helping patients navigate life's challenges."
    },
    {
      _id: "doctor8",
      name: "Dr. David Sharma",
      expertise: ["Pulmonology", "Critical Care", "Sleep Medicine"],
      image: "https://img.freepik.com/free-photo/handsome-doctor-with-stethoscope-isolated-blue_376433-2201.jpg",
      desc: "Pulmonary specialist with expertise in respiratory conditions, sleep disorders, and critical care medicine."
    }
  ];

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    dispatch(getdoctor());
  }, [dispatch]);

  // Set doctors when API data is loaded or use defaults
  useEffect(() => {
    if (doctor?.doctors && doctor.doctors.length > 0) {
      setDoctors(doctor.doctors);
      setLoadingError(false);
    } else {
      setDoctors(defaultDoctors);
      if (error) {
        setLoadingError(true);
      }
    }
  }, [doctor, error]);

  return (
    <>
      <Loading isloading={isLoading} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h3" 
          component="h1"
          sx={{
            color: "black",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
            mb: 4
          }}
        >
          OUR DOCTORS
        </Typography>

        {loadingError && (
          <Alert severity="info" sx={{ mb: 3 }}>
            We're experiencing technical difficulties. Showing our featured doctors.
          </Alert>
        )}

        <Grid container spacing={3}>
          {doctors.map((item) => (
            <Grid
              item
              key={item._id}
              xs={12}
              sm={6}
              md={3}
            >
              <DoctorCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Doctor;
