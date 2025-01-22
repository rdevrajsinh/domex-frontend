import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar'; 
import DomainList from './components/DomainList';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for login status (you could store it in localStorage or context for persistence)
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn'); // For persistence
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // Store login status in localStorage
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn'); // Remove login status on logout
  };

  return (
    <div className="app-container">
      
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={
          <><Sidebar />
          <Register />
          </>
          } />
        <Route path="/domainlist" element={
           <>
              <Sidebar />
              
            <DomainList onLogout={handleLogout} />
            </>
          } />
      </Routes>
    </div>
  );
};

export default App;
