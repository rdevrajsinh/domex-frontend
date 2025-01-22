import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
import "./Login.css"; // Import the CSS file for styling

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://flask-backend-alpha.vercel.app/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }, { withCredentials: true });

      if (response.ok) {
        toast.success("Registration successful!", {
          autoClose: 2000, // Toast will auto-close after 3 seconds
          onClose: () => {
            // After the toast closes, perform the redirect
            navigate("/"); // Redirect to login page
          }
        });
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed");
        toast.error(data.error || "Registration failed", {
          autoClose: 3000, // Toast will auto-close after 3 seconds
        });
      }
    } catch (err) {
      setError("An error occurred while registering.");
      toast.error("An error occurred while registering.", {
        autoClose: 3000, // Toast will auto-close after 3 seconds
      });
    }
  };

  return (
    <div className="main-login">
      <div className="geeks">
        <span>D</span>
        <span>o</span>
        <span>m</span>
        <span>E</span>
        <span>X</span>
      </div>
 
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Register</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button type="submit" className="login-button">Register</button>
          </form>
        </div>
      </div>

      {/* Toast container to render toasts */}
      <ToastContainer />
    </div>
  );
};

export default Register;
