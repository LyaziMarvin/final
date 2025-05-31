import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "./config";
const CloneAgentInterface = () => {
  const [step, setStep] = useState("describeFeelings");
  const [feelingsText, setFeelingsText] = useState("");
  const [memoryText, setMemoryText] = useState("");
  const [story, setStory] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    if (!userID) {
      alert("Please log in to access the agent.");
      navigate("/login");
    }
  }, [navigate, userID]);

  const handleNextStep = () => {
    if (step === "describeFeelings" && feelingsText.trim()) {
      setStep("describeMemory");
    } else if (step === "describeMemory" && memoryText.trim()) {
      setStep("done");
    }
  };

  const handleGenerateStory = async () => {
    const res = await axios.post(`${config.API_URL}/api/generate-story`, {
      message: `${feelingsText} ${memoryText}`,
      userID,
    });
    setStory(res.data.story);
  };

  const handleSpeakStory = async () => {
    const res = await axios.post(
      `${config.API_URL}/api/speak-story`,
      { story, userID },
      { responseType: "blob" }
    );
    const blob = new Blob([res.data], { type: "audio/mpeg" });
    setAudioUrl(URL.createObjectURL(blob));
  };

  const handleGenerateImage = async () => {
    try {
      const res = await axios.post(`${config.API_URL}/api/generate-image`, {
        memory: memoryText,
        userID,
      });
      setImageUrl(res.data.imageUrl);
    } catch (err) {
      console.error("Image generation error:", err);
    }
  };

  const handleGeneratePlaylist = async () => {
    if (!userID || !feelingsText) return;

    try {
      const res = await axios.post(`${config.API_URL}/api/generate-playlist`, {
        message: `${feelingsText}`,
        userID,
      });
      setPlaylists(res.data.playlists);
    } catch (err) {
      console.error("Playlist error:", err.response?.data || err.message);
    }
  };

  const promptText =
    step === "describeFeelings"
      ? "📝 How are you feeling today?"
      : step === "describeMemory"
      ? "📖 Share a memory that comes to mind:"
      : "✅ All inputs captured. Ready to generate!";

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🧠 My Voice Agent</h2>
      <p style={promptStyle}><strong>{promptText}</strong></p>

      {step !== "done" && (
        <div style={sectionStyle}>
          {step === "describeFeelings" && (
            <>
              <textarea
                value={feelingsText}
                onChange={(e) => setFeelingsText(e.target.value)}
                placeholder="Type your current feelings..."
                style={textAreaStyle}
              />
              <button onClick={handleNextStep} style={buttonStyle("#2196F3")}>
                Next
              </button>
            </>
          )}

          {step === "describeMemory" && (
            <>
              <textarea
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                placeholder="Type a memory you recall..."
                style={textAreaStyle}
              />
              <button onClick={handleNextStep} style={buttonStyle("#673ab7")}>
                Submit
              </button>
            </>
          )}
        </div>
      )}

      {step === "done" && (
        <div style={sectionStyle}>
          <div style={buttonGroupStyle}>
            <button onClick={handleGenerateStory} style={buttonStyle("#795548")}>Generate Story</button>
            <button onClick={handleSpeakStory} style={buttonStyle("#3f51b5")}>Narrate Story</button>
            <button onClick={handleGenerateImage} style={buttonStyle("#9c27b0")}>Generate Image</button>
            <button onClick={handleGeneratePlaylist} style={buttonStyle("#e91e63")}>Get Music Playlist</button>
          </div>

          {story && <p style={storyStyle}><strong>📝 Story:</strong> {story}</p>}
          {audioUrl && <audio controls src={audioUrl} style={mediaStyle}></audio>}
          {imageUrl && <img src={imageUrl} alt="Generated memory" style={mediaStyle} />}

          <div style={playlistContainerStyle}>
            {playlists.map((playlist, i) => (
              <a
                key={i}
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                style={playlistLinkStyle}
              >
                <img src={playlist.thumbnail} alt={playlist.title} style={thumbnailStyle} />
                {playlist.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles (same as before)
const containerStyle = {
  padding: "2rem",
  maxWidth: 800,
  margin: "40px auto",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: 24,
  fontSize: "2rem",
  color: "#222",
};

const promptStyle = {
  fontSize: "1.1rem",
  marginBottom: 24,
  color: "#555",
  textAlign: "center",
};

const sectionStyle = {
  marginTop: 24,
  textAlign: "center",
};

const textAreaStyle = {
  width: "100%",
  height: "100px",
  padding: "12px",
  fontSize: "1rem",
  borderRadius: "10px",
  border: "1px solid #ccc",
  marginBottom: "12px",
  resize: "none",
};

const buttonStyle = (color) => ({
  margin: "10px",
  padding: "10px 22px",
  fontSize: "1rem",
  backgroundColor: color,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.3s",
});

const mediaStyle = {
  marginTop: 20,
  width: "100%",
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const storyStyle = {
  marginTop: 20,
  padding: "16px",
  backgroundColor: "#f9f9f9",
  borderRadius: "10px",
  lineHeight: 1.6,
  color: "#333",
};

const playlistContainerStyle = {
  marginTop: 24,
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  justifyContent: "center",
};

const playlistLinkStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
  borderRadius: "10px",
  padding: "12px",
  textDecoration: "none",
  color: "#333",
  width: 250,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  transition: "transform 0.2s",
};

const thumbnailStyle = {
  width: 64,
  height: 64,
  borderRadius: "6px",
  marginRight: 12,
  objectFit: "cover",
};

const buttonGroupStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "12px",
  marginTop: "20px",
};

export default CloneAgentInterface;
