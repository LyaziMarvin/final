import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from "./config";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_URL}/login`, { email });
      localStorage.setItem('token', response.data.token); // Store JWT token
      localStorage.setItem('userID', response.data.userID); // Store userID for score tracking
      alert('Login successful');
      navigate('/agents'); // Redirect to score submission page
    }catch (error) {
  console.error('Login failed:', error);

  if (error.response) {
    alert(error.response.data.error); // show backend error
  } else {
    alert('Login failed due to network or server error');
  }
}

  };

  return (
    <div style={bodyStyle}>
      <form style={formStyle} onSubmit={handleLogin}>
        <h1 style={headerStyle}>Login</h1>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Email:</label>
          <input
            style={inputStyle}
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button style={{ ...buttonStyle, marginLeft: '10px' }} type="submit">
          Login
        </button>

        <p>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: 'blue' }}>
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

// Styles
const bodyStyle = {
  backgroundColor: '#f5f5f5',
  padding: '20px',
  minHeight: '70vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const formStyle = {
  width: '100%',
  maxWidth: '500px',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  boxSizing: 'border-box',
};

const headerStyle = {
  textAlign: 'center',
  color: '#0E5580',
  marginBottom: '20px',
};

const inputContainerStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  color: '#333',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  backgroundColor: '#0E5580',
  color: 'white',
  padding: '10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100px',
  textAlign: 'center',
};



export default Login;

