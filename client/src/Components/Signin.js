import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/v1/login', formData);
  
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        // Redirect or perform actions after successful login
      } else {
        console.error('Login failed:', response.data);
        // Handle login failure, e.g., show an error message
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      console.error('Server response:', error.response.data); // Log more details
      // Handle other errors, e.g., network issues
    }
  };
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
