import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress }) => {
  const barStyle = {
    width: `${progress}%`,
    backgroundColor: '#c2183c', // Red color
    height: '20px',
    transition: 'width 0.9s ease-in-out'
  };

  return (
    <div className="progress-container">
      <div style={barStyle}></div>
    </div>
  );
};

export default ProgressBar;
