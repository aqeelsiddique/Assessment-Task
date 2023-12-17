import React from 'react';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/v1/logout', {
        method: 'POST', // or 'GET' depending on your server setup
        credentials: 'include', // Include credentials to send cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Successful logout
        console.log('Logout successful');
        // You may want to redirect the user or perform other actions here
      } else {
        // Logout failed
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
