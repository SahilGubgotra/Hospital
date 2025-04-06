import React from "react";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doctorloginAsync } from "../slices/Loginslice";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Box } from "@mui/system";

// Create a custom error component to ensure errors are rendered as strings
const ErrorDisplay = ({ children }) => {
  return <div>{children}</div>;
};

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (values) => {
    try {
      // console.log(values);
      const data = await dispatch(doctorloginAsync(values));

      if (data.meta.requestStatus === "rejected") {
        toast.error(data.payload.message || "Login failed");
        return;
      }

      // Get doctor token 
      const doctorToken = localStorage.getItem("doctortoken");
      const is_doctor = localStorage.getItem("is_doctor");
      
      // Ensure token has Bearer prefix
      if (doctorToken && is_doctor) {
        const tokenWithBearer = doctorToken.startsWith("Bearer ") 
          ? doctorToken 
          : `Bearer ${doctorToken}`;
        
        localStorage.setItem("doctortoken", tokenWithBearer);
        console.log("Doctor token stored with Bearer prefix:", tokenWithBearer);
        
        navigate("/");
        window.location.reload();
        toast.success("Doctor login successful");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  const validationSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  return (
    <>
      <Box>
        <Container
          maxWidth="xs"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minHeight: "70vh",
            marginTop: "100px"
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Doctor Login
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="text"
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
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Container>
      </Box>
    </>
  );
}

export default LoginForm;
