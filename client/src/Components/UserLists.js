import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import Navbar from './Navbar';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [jwtToken, setJwtToken] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/v1/admin/allusers', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        setUsers(response.data.users);
      } else {
        console.error('Failed to fetch users:', response.data.message);
      }
    } catch (error) {
      console.error('Error during user fetch:', error.message);
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
      }
    } catch (error) {
      console.error('Error during user deletion:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [jwtToken]);

  return (
    <div>
      <h2>User List</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            {/* Add more TableCells for other user properties */}
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              {/* Add more TableCells for other user properties */}
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
