import React, { useState } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });

  const [error, setError] = useState(null); // State to manage registration errors
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate(); // Access the navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear previous error when the user starts typing again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/v1/register', formData);

      if (response.status === 200) {
        // Registration successful, show success snackbar
        setSuccessSnackbarOpen(true);
        console.log('Registration successful:', response.data);

        // Delay the navigation after showing the success message
        setTimeout(() => {
          // Redirect to the desired page using navigate
          navigate('/signin'); // Change '/login' to the desired page path
        }, 3000); // 5000 milliseconds (5 seconds)
      } else {
        // Registration failed, handle the error
        console.error('Registration failed:', response.data);
        setError(response.data.error); // Set error state with the server message
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
      setError('An error occurred. Please try again later.'); // Set a generic error message
    }


  };

  const handleSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>} {/* Display error if exists */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
          <TextField
            label="Confirm Password"
            fullWidth
            margin="normal"
            type="password"
            name="cpassword"
            value={formData.cpassword}
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
            Register
          </Button>
        </form>
      </Paper>

      {/* Snackbar for success message */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000} // Adjust the duration as needed
        onClose={handleSnackbarClose}
        message="Registration successful!"
      />
    </Container>
  );
};

export default RegisterForm;
