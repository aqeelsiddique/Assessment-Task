import React, { useState } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
} from '@mui/material';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your API endpoint
      const response = await axios.post('/api/v1/register', formData);

      // Check the response status
      if (response.status === 200) {
        // Registration successful, you can handle the response data here
        console.log('Registration successful:', response.data);
      } else {
        // Registration failed, handle the error
        console.error('Registration failed:', response.data);
      }
    } catch (error) {
      // Handle other errors, such as network issues
      console.error('Error during registration:', error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
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
            style={{ marginTop: 20 }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterForm;
