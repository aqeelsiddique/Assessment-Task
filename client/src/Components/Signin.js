import React, { useState } from "react";
import axios from "axios";
import { Typography, TextField, Button, Container, Paper, Alert } from "@mui/material";
import { useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null); // State to manage login error
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("/api/v1/login", formData);
  
      if (response.status === 200) {
        console.log("Login successful:", response.data);
  
        // Check the role in the response data
        const userRole = response.data.role;
  
        if (userRole === "admin") {
          // If the user is an admin, navigate to the admin profile
          navigate("/adminprofile");
        } else {
          // For regular users, navigate to the user profile
          navigate("/userprofile");
        }
      } else {
        console.error("Login failed:", response.data);
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      console.error("Server response:", error.response.data);
      setError("An error occurred. Please try again later.");
    }
  };
  

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>} {/* Display error if exists */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 20, background: theme.palette.warning.light }}
          >
            Login
          </Button>
          
        </form>
      </Paper>
    </Container>
  );
};

export default LoginForm;
