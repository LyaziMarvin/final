import React from "react";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem('userID');
  const isLoggedIn = !!userId; // or you can also check token

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userSession');

    // ✅ Remove "Checkmate" status but keep timestamp
    const storedCompletedTests = JSON.parse(localStorage.getItem('completedTests')) || {};
    if (userId && storedCompletedTests[userId]) {
      Object.keys(storedCompletedTests[userId]).forEach((category) => {
        if (storedCompletedTests[userId][category].status === "Checkmate") {
          storedCompletedTests[userId][category] = {
            completedAt: storedCompletedTests[userId][category].completedAt
          };
        }
      });
      localStorage.setItem('completedTests', JSON.stringify(storedCompletedTests));
    }

    alert('Logout successful');
    
    navigate('/');
  };

  if (!isLoggedIn) return null; // 👈 Don't show the component if user is not logged in

  return (
    <div style={logoutContainer} onClick={handleLogout}>
      <LogOut size={30} color="white" style={iconStyle} />
      <span style={logoutTextStyle}>Logout</span>
    </div>
  );
};

// Styles
const logoutContainer = {
  position: 'fixed',
  top: '10px',
  right: '10px',
  backgroundColor: '#0E5580',
  padding: '10px 15px',
  borderRadius: '25px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const iconStyle = {
  cursor: 'pointer',
};

const logoutTextStyle = {
  color: 'white',
  marginLeft: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
};

export default Logout;