import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Telescope, User } from "lucide-react";
import "./WelcomePage.css";
import Background from './Background.png'; 

const WelcomePage = () => {
  const navigate = useNavigate();
  const [guestAge, setGuestAge] = useState('');
  const [askAge, setAskAge] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGuestClick = () => {
    setAskAge(true);
  };

  const handleAgeSubmit = async () => {
    if (!guestAge || guestAge < 1 || guestAge > 120) {
      alert("Please enter a valid age");
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await fetch("https://your-backend.com/api/guest", {  //لما يجهز الصح
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age: guestAge })
      });
  
      if (!response.ok) {
        throw new Error("Failed to create guest");
      }
  
      const data = await response.json();
      // السيرفر يرجع مثلاً { guestId: "Guest22", age: 25 }
      console.log("Guest created:", data);
      
      localStorage.setItem("guestId", data.guestId);
      localStorage.setItem("guestAge", data.age);
  
      navigate("/Explora/guest");
    } catch (error) {
      console.error(error);
      alert("Could not create guest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="welcome-page">
      <div className="welcome-box">
        <div className="welcome-header">
          <Telescope className="welcome-icon" />
          <h1 className="welcome-title">NASA Eyes</h1>
          <p className="welcome-subtitle">
            Explore the universe through your eyes. Contribute, learn, and be part of discovery.
          </p>
        </div>

        {askAge ? (
          <div className="guest-age-form">
            <label>Enter your age:</label>
            <input
              type="number"
              value={guestAge}
              onChange={(e) => setGuestAge(e.target.value)}
              placeholder="Your age"
              min="1"
              max="120"
            />
            <button
              onClick={handleAgeSubmit}
              className="btn btn-continue"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Continue"}
            </button>
            <button
        onClick={() => { setAskAge(false); setGuestAge(''); }}
        className="btn btn-cancel"
        disabled={isSubmitting}
      >
        Cancel
      </button>
          </div>
        ) : (
          <div className="welcome-buttons">
            <button onClick={() => navigate("/Explora/login")} className="btn btn-primary">
              Log in / Register
            </button>
            <button onClick={handleGuestClick} className="btn btn-secondary">
              <User className="btn-icon" />
              Continue as Guest
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;


