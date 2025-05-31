import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from "./config";

const Registration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [culture, setCulture] = useState('');
  const [language, setLanguage] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.API_URL}/register`, {
        email,
        age: Number(age),
        culturalBackground: culture,
        language,
        gender,
        country,
      });
      alert('Registration successful. Please login.');
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Error registering user');
    }
  };

  return (
    <div style={bodyStyle}>
      <form style={formStyle} onSubmit={handleRegister}>
        <h1 style={headerStyle}>Registration Form</h1>

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

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Age:</label>
          <select
            style={inputStyle}
            value={age}
            required
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="">Select Age</option>
            {[...Array(51)].map((_, i) => {
              const ageValue = 50 + i;
              return (
                <option key={ageValue} value={ageValue}>
                  {ageValue}
                </option>
              );
            })}
          </select>
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Cultural Background:</label>
          <select
            style={inputStyle}
            value={culture}
            required
            onChange={(e) => setCulture(e.target.value)}
          >
            <option value="">Select</option>
            <option value="African">African</option>
            <option value="Asian">Asian</option>
            <option value="European">European</option>
            <option value="Latin American">Latin American</option>
            <option value="Middle Eastern">Middle Eastern</option>
            <option value="Indigenous">Indigenous</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Language:</label>
          <select
            style={inputStyle}
            value={language}
            required
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Swahili">Swahili</option>
            <option value="Arabic">Arabic</option>
            <option value="Mandarin">Mandarin</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Sex:</label>
          <select
            style={inputStyle}
            value={gender}
            required
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Country of Stay:</label>
          <select
            style={inputStyle}
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            <option value="Kenya">Kenya</option>
            <option value="Nigeria">Nigeria</option>
            <option value="South Africa">South Africa</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="India">India</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button style={buttonStyle} type="submit">
          Submit
        </button>

        <p>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

// Styles
const bodyStyle = {
  backgroundColor: "#f5f5f5",
  padding: "20px",
  minHeight: "70vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formStyle = {
  width: "100%",
  maxWidth: "500px",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  boxSizing: "border-box",
};

const headerStyle = {
  textAlign: "center",
  color: "#0E5580",
  marginBottom: "20px",
};

const inputContainerStyle = {
  marginBottom: "15px",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const buttonStyle = {
  backgroundColor: "#0E5580",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  width: "100px",
  textAlign: "center",
};

export default Registration;

