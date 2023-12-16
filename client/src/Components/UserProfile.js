import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Container,
} from '@mui/material';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('view'); // 'view' or 'edit'

  useEffect(() => {
    // Fetch user profile data when the component mounts
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/v1/me', {
          headers: {
            Authorization: `Bearer YOUR_JWT_TOKEN`, // Include the actual token in the headers
          },
        });

        if (response.status === 200) {
          // Set the user profile data in state
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
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  const handleUpdateProfile = async () => {
    try {
      // Make a PUT request to update the user profile
      const response = await axios.put(
        '/api/v1/me/update',
        { name, email },
        {
          headers: {
            Authorization: `Bearer YOUR_JWT_TOKEN`, // Include the actual token in the headers
          },
        }
      );

      if (response.status === 200) {
        console.log('User profile updated successfully');
        setMode('view'); // Switch back to view mode after updating
      } else {
        console.error('Failed to update user profile:', response.data.message);
      }
    } catch (error) {
      console.error('Error during user profile update:', error.message);
    }
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'view' ? 'edit' : 'view'));
  };

  return (
    <Container component="main" maxWidth="xs">

      <h1>WELLCOME</h1>
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
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={toggleMode}
                  >
                    Edit Profile
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
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={toggleMode}
                  >
                    Cancel
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default UserProfile;
