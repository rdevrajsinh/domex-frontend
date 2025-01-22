import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css'; // Add your own styles here

const Sidebar = () => {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();  // Use the useNavigate hook to navigate programmatically

  // Define the handleSelect function that will handle the sidebar item selection
  const handleSelect = (selection, path) => {
    setSelected(selection); // Update the state with the selected item
    navigate(path);  // Navigate to the specified path (URL)
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      
      {/* Display the selected item on top of the sidebar */}
   

      <ul className="sidebar-menu">
        <li onClick={() => handleSelect('domains', '/domainlist')}>
          Domains
        </li>
        <li onClick={() => handleSelect('register', '/register')}>
          Add User
        </li>
        {/* Add more navigation items as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
