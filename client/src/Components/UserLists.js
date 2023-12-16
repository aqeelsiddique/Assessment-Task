import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Typography, Alert } from '@mui/material';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [jwtToken, setJwtToken] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/v1/admin/allusers', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        setUsers(response.data.users);
        setError(''); // Reset error state if successful
      } else {
        console.error('Failed to fetch users:', response.data.message);
        setError(response.data.message); // Set error state
      }
    } catch (error) {
      console.error('Error during user fetch:', error.message);
      setError('You are not authorized to access this resource.'); // Set error state
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/api/v1/admin/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        console.log('User deleted successfully');
        fetchUsers(); // Fetch users again after deletion
      } else {
        console.error('Failed to delete user:', response.data.message);
        setError(response.data.message); // Set error state
      }
    } catch (error) {
      console.error('Error during user deletion:', error.message);
      setError('An error occurred while deleting the user.'); // Set error state
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [jwtToken]);

  return (
    <div>
      <h2>User List</h2>
      {error && <Alert severity="error">{error}</Alert>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button onClick={() => deleteUser(user._id)} variant="outlined" color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
