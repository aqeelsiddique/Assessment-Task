import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Container,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('view'); // 'view' or 'edit'
  const [logoutSuccess, setLogoutSuccess] = useState(false); // State for logout success
  const navigate = useNavigate(); // Access the navigate function

  useEffect(() => {
    // Fetch user profile data when the component mounts
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/v1/me', {
          headers: {
            Authorization: `Bearer YOUR_JWT_TOKEN`,
          },
        });

        if (response.status === 200) {
          setName(response.data.user.name);
          setEmail(response.data.user.email);
        } else {
          console.error('Failed to fetch user profile:', response.data.message);
        }
      } catch (error) {
        console.error('Error during user profile fetch:', error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        '/api/v1/me/update',
        { name, email },
        {
          headers: {
            Authorization: `Bearer YOUR_JWT_TOKEN`,
          },
        }
      );

      if (response.status === 200) {
        console.log('User profile updated successfully');
        setMode('view');
      } else {
        console.error('Failed to update user profile:', response.data.message);
      }
    } catch (error) {
      console.error('Error during user profile update:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/v1/logout');

      if (response.status === 200) {
        // Logout successful
        console.log('Logout successful');
        setLogoutSuccess(true);

        // Delay the navigation for 1 second
        setTimeout(() => {
          // Navigate to the login page
          navigate('/signin');
        }, 1000);
      } else {
        // Logout failed
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'view' ? 'edit' : 'view'));
  };

  const handleAlertClose = () => {
    setLogoutSuccess(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <h1>WELCOME</h1>
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <form>
          <Grid container spacing={2}>
            {mode === 'view' ? (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6">Name: {name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Email: {email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" fullWidth onClick={toggleMode}>
                    Edit Profile
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" fullWidth onClick={handleLogout}>
                    Logout
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleUpdateProfile}
                  >
                    Update Profile
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="outlined" fullWidth onClick={toggleMode}>
                    Cancel
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </Paper>

      {/* Snackbar for logout success message */}
      <Snackbar
        open={logoutSuccess}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
        <Alert severity="success" onClose={handleAlertClose}>
          Logout successful!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile;
