import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
import "./Login.css"; // Import the CSS file for styling

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://flask-backend-alpha.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!", {
          autoClose: 2000,
          onClose: () => {
            // After the toast closes, perform the redirect
            navigate("/domainlist");
          }
        });
        onLogin(); // Call onLogin after successful login
      } else {
        setError(data.error || "Login failed");
        toast.error(data.error || "Login failed"); // Show error toast on failure
      }
    } catch (err) {
      setError("An error occurred while logging in.");
      toast.error("An error occurred while logging in."); // Show error toast on exception
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
      <p className="description">Welcome to the DomEX platform! Please login to continue.</p>
 
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
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
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
      
      {/* Toast container to render toasts */}
      <ToastContainer />
    </div>
  );
};

export default Login;
