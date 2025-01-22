import React, { useState } from 'react';
import axios from 'axios';
import './AddDomainForm.css';  // Import a specific CSS file for AddDomainForm if necessary

const AddDomainForm = ({ onDomainAdded }) => {
  const [domainName, setDomainName] = useState('');
  const [customOption, setCustomOption] = useState('option1');  // State for the custom dropdown
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // For success message

  const handleDomainChange = (event) => {
    setDomainName(event.target.value);
  };

  const handleCustomOptionChange = (event) => {
    setCustomOption(event.target.value);  // Set selected option
  };

  const handleAddDomain = async () => {
    setError('');
    if (!domainName) {
      setError('Domain name is required');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post('https://flask-backend-alpha.vercel.app/api/domain', {
        domain_name: domainName,
        custom_option: customOption,
      }, { withCredentials: true });  // Add withCredentials here
  
      if (response.status === 201) {
        // Success logic
        const domain = { ...response.data, server_name: response.data.server_name || [] };
        onDomainAdded(domain);
        setDomainName('');
        setCustomOption('option1');
        setSuccessMessage('Domain added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError('Failed to add domain. Please try again.');
      console.error(err);  // Log error to see more details
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="add-domain-form">
      <input
        type="text"
        value={domainName}
        onChange={handleDomainChange}
        placeholder="Enter domain name"
        className="domain-input"  // Style for input field
      />
<br></br>
      {/* Dropdown for selecting custom option */}
      <select 
        value={customOption} 
        onChange={handleCustomOptionChange} 
        className="custom-option-dropdown"
      >
        <option value="Server 1">Server 1</option>
        <option value="Server 2">Server 2</option>
        <option value="Server 3">Server 3</option>
      </select>
<br></br>
      <button
        onClick={handleAddDomain}
        className="add-domain-button-form"
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? 'Adding...' : 'Add Domain'}
      </button>

      {error && <p className="error-message">{error}</p>}  {/* Styled error message */}

      {/* Success Flash Message Popup */}
      {successMessage && (
        <div className="success-flash-card">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default AddDomainForm;
