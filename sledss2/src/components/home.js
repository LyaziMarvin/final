import React from "react";
import image from "./images/ruben9.png";
import image1 from "./images/ruben10.png";
import logo from "./images/cape1.png";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'

 // Custom hook to get query parameters (userId)
const useUserId = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return queryParams.get('userId'); // '12345'
};

const Home = () => {
    const navigate = useNavigate();
    const userId = useUserId(); // Call the custom hook here, at the top of the component
    const [storedUserId, setStoredUserId] = useState(null); // State to store the userId
  

    useEffect(() => {
      if (userId) {
        setStoredUserId(userId); // Store userId in state
        localStorage.setItem('userID', userId); // Store userId in localStorage
      }
    }, [userId]); // Dependency array ensures it runs only when userId changes
 


  const handleEvaluationClick = () => {
    navigate("");
  };

  return (
    <div>
      <div style={pageStyle}>
        <div style={leftColumnStyle}>
          <img src={image} alt="pic" style={squareImageStyle} />
          <div style={textStyle}>
            <p style={paragraphStyle}>
              Personalized Services: The first step is to assess your current situation. We use several
              standard evaluations to get a basic understanding of your personal needs and lifestyle habits.
              It’s recommended you take all the S.L.E.D.S.S. Evaluations for a full picture of your lifestyle habits. However, you can also choose to take a few to start the process.
            </p>
          </div>
        </div>

        <div style={rightColumnStyle}>
          <p style={paragraphStyle}>
            The Kin-Keepers’ S.L.E.D.S.S. Process <br />teaches you how to improve brain health by creating healthy habits in these six areas of life:
          </p>
          <img src={image1} alt="pic" style={circleImageStyle} />
          <button style={evaluationButtonStyle} onClick={handleEvaluationClick}>
            S.L.E.D.S.S. Evaluations
          </button>
        </div>
      </div>

      <div style={bottomSectionStyle}>
        <div style={researchStyle}>
          <p style={paragraphStyle}>
            Research shows that lifestyle factors like unhealthy diets, lack of exercise, stress, poor sleep, and being alone
            can cause and worsen dementia, including Alzheimer’s. But there’s also good news from the research.
          </p>
          <h3 style={{ color: 'red', fontSize: '20px' }}>Improving lifestyle habits can improve your cognitive health!</h3>
          <p style={paragraphStyle}>
            The healthy habits promoted by the Kin-Keepers’ S.L.E.D.S.S. Process follow recommendations from the National Institute of Health and prominent cognitive health researchers, including:
          </p>
          <ul style={paragraphStyle}>
            <li style={{ fontSize: '20px' }}><strong>Dr. Rudolph Tanzi</strong>, Neuroscientist from Harvard's McCance Center for Brain Health.</li>
            <li style={{ fontSize: '20px' }}><strong>Dr. Dean Ornish</strong>, President and founder of the Preventive Medicine Research Institute in Sausalito, California.</li>
          </ul>
        </div>

        <div style={footerStyle}>
          <div style={footerColumnStyle}>
            <img src={logo} alt="Kin-Keepers Logo" style={logoStyle} />
          </div>
          <div style={footerColumnStyle}>
            <ul>
              <ul><a href="/" style={{ ...footerLinkStyle, fontSize: '20px' }}>HOME</a></ul><br />
              <ul><a href="#" style={{ ...footerLinkStyle, fontSize: '20px' }}>ABOUT</a></ul><br />
              <ul><a href="#" style={{ ...footerLinkStyle, fontSize: '20px' }}>SIGN UP</a></ul>
            </ul>
          </div>

          <div style={footerColumnStyle}>
            <h4 style={{ fontSize: '20px' }}>Kin-Keepers Solutions</h4>
            <ul>
              <ul><a href="#" style={{ ...footerLinkStyle, fontSize: '20px' }}>ElderCHAT</a></ul><br />
              <ul><a href="#" style={{ ...footerLinkStyle, fontSize: '20px' }}>Family Circle</a></ul><br />
              <ul><a href="#" style={{ ...footerLinkStyle, fontSize: '20px' }}>S.L.E.D.S.S.</a></ul>
            </ul>
          </div>

          <div style={footerColumnStyle}>
            <h4 style={{ fontSize: '20px' }}>Connect with us</h4>
            <div style={socialMediaContainer}>
              <div style={socialButtonStyle}>
                {/* Social Button */}
              </div>
              <div style={socialButtonStyle}>
                {/* Social Button */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '20px',
  backgroundColor: 'white'
};

const leftColumnStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px'
};

const rightColumnStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px'
};

const squareImageStyle = {
  width: '650px',
  height: '250px',
  borderRadius: '20px',
  objectFit: 'cover'
};

const textStyle = {
  display: 'flex',
  textAlign: 'center',
  marginTop: '20px'
};

const paragraphStyle = {
  color: '#02678E',
  textAlign: 'left',
  margin: '0 0 20px 0',
  padding: '0',
  lineHeight: '1.6',
  fontSize: '20px'
};

const evaluationButtonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  backgroundColor: '#83A322',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '20px',
  cursor: 'pointer'
};

const circleImageStyle = {
  width: '300px',
  height: '300px',
  borderRadius: '20px',
  objectFit: 'cover'
};

const bottomSectionStyle = {
  backgroundColor: '#f0f8e6',
  padding: '20px'
};

const researchStyle = {
  border: '2px solid #02678E',
  padding: '20px',
  backgroundColor: '#f0f8e6',
  marginBottom: '30px',
  borderRadius: '10px'
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#02678E',
  color: 'white',
  padding: '20px'
};

const footerColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
};

const footerLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '20px'
};

const logoStyle = {
  width: '100px',
  marginBottom: '10px'
};

const socialMediaContainer = {
  display: 'flex',
  gap: '10px',
  backgroundColor: '#FFFFE0',
  padding: '10px',
  borderRadius: '5px'
};

const socialButtonStyle = {
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  borderRadius: '5px'
};

export default Home;


