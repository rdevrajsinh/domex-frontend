import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddDomainForm from './AddDomainForm';
import './DomainList.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DomainList = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [editableDomain, setEditableDomain] = useState(null);
  const [updatedCustomOption, setUpdatedCustomOption] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null); 
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);  // To toggle between edit and view modes
const [editableCustomOption, setEditableCustomOption] = useState('');

  // Fetch the list of domains
  const fetchDomains = async () => {
    try {
      const response = await axios.get('https://flask-backend-alpha.vercel.app/api/domains', { withCredentials: true });
      setDomains(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching domains', error);
      setLoading(false);
    }
  };

  const isDomainActive = (expiryDate) => {
    const currentDate = new Date();
    const expiryDateObj = new Date(expiryDate);
    return expiryDateObj > currentDate;
  };

  const handleShowAddDomainModal = () => setShowAddDomainModal(true);
  const handleCloseAddDomainModal = () => setShowAddDomainModal(false);

  const handleDomainAdded = (newDomain) => {
    setDomains((prevDomains) => [...prevDomains, newDomain]);
    toast.success('Domain added successfully!', { autoClose: 3000 });
    setShowAddDomainModal(false);
  };

  const handleDelete = async (domainName) => {
    try {
      const response = await axios.delete(`https://flask-backend-alpha.vercel.app/api/domain/${domainName}`, { withCredentials: true });
      if (response.status === 200) {
        setDomains((prevDomains) => prevDomains.filter((domain) => domain.domain_name !== domainName));
        toast.success('Domain deleted successfully!', { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error deleting domain', error);
      toast.error('Error deleting domain. Please try again.', { autoClose: 3000 });
    }
  };

  const handleLogoClick = async () => {
    try {
      const response = await fetch("https://flask-backend-alpha.vercel.app/api/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        navigate('/');
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred while logging out:", error);
    }
  };

  const handleEditClick = (domain) => {
    setEditableDomain(domain);
    setUpdatedCustomOption(domain.custom_option);
  };

  const handleSaveClick = async (domainName) => {
    try {
      const response = await axios.put(
        `https://flask-backend-alpha.vercel.app/api/domain/${domainName}`,
        {
          custom_option: updatedCustomOption,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setDomains((prevDomains) =>
          prevDomains.map((domain) =>
            domain.domain_name === domainName
              ? { ...domain, custom_option: updatedCustomOption }
              : domain
          )
        );
        toast.success('Domain updated successfully!', { autoClose: 3000 });
        setEditableDomain(null);
      }
    } catch (error) {
      console.error('Error updating domain', error);
      toast.error('Error updating domain. Please try again.', { autoClose: 3000 });
    }
  };

  const handleSave = async (domainName) => {
    try {
      const response = await axios.put(
        `https://flask-backend-alpha.vercel.app/api/domain/${domainName}`,
        {
          custom_option: editableCustomOption,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setDomains((prevDomains) =>
          prevDomains.map((domain) =>
            domain.domain_name === domainName
              ? { ...domain, custom_option: editableCustomOption }
              : domain
          )
        );
        toast.success('Domain updated successfully!', { autoClose: 3000 });
        setEditableDomain(null);
      }
    } catch (error) {
      console.error('Error updating domain', error);
      toast.error('Error updating domain. Please try again.', { autoClose: 3000 });
    }
  };




  const handleCancelEdit = () => {
    setEditableDomain(null);
  };

  const handleSelect = (selection, path) => {
    
    navigate(path);
  };
  // Show more info modal
  const handleShowMoreInfo = (domain) => {
    setSelectedDomain(domain);
    setShowMoreInfoModal(true);
  };

  const handleCloseMoreInfoModal = () => {
    setShowMoreInfoModal(false);
    setSelectedDomain(null);
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  if (loading) return <div>Loading domains...</div>;

  // Filtered domains based on the search term
  const filteredDomains = domains.filter((domain) =>
    (domain.domain_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  return (
    <div className="main">
      <header className="header">
        {/*<div className="geeks">
          <span>D</span>
          <span>o</span>
          <span>m</span>
          <span>E</span>
          <span>X</span>
        </div>*/}
        <img
          src="https://cdn-icons-png.flaticon.com/512/8847/8847419.png"
          alt="Logo"
          className="header-logo"
          onClick={toggleMenu}  // Toggle menu on logo click
        />

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="logout-menu">
            <button onClick={handleLogoClick} className="logout-btn">
              <img
              src='https://cdn-icons-png.flaticon.com/128/10309/10309341.png'
              class = 'sidebar-icon'
              >
              
              </img>
              Log Out
            </button>
            <button onClick={() => handleSelect('register', '/register')} className="reg-btn">
              <img
              src='https://cdn-icons-png.flaticon.com/128/16765/16765670.png'
              class = 'sidebar-icon'
              >
              </img>
              Add User
            </button>
          </div>
        )}
      </header>

      <div>
        <br />
        <Button className="add-domain-btn-container" variant="primary" onClick={handleShowAddDomainModal}>
          Add Domain
        </Button>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search domains by name..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="domain-color">
        <div className="domain-list-container">
          <table className="domain-table full-table">
            <thead>
              <tr>
                <th>Domain</th>
                {/* Hide other columns on mobile */}
                <th className="mobile-only">Expiry</th>
                <th className="mobile-only">Organization</th>
                <th className="mobile-only">Server{' '}Names</th>
                <th className="mobile-only">Storage</th>
                <th className="mobile-only">Active</th>
                <th className="mobile-only">Created</th>
                <th className="mobile-only">Updated</th>
                <th className="mobile-only" > Action</th>
                 
              </tr>
            </thead>
            <tbody>
              {filteredDomains.map((domain) => (
                <tr key={domain.id}>
                  <td>{domain.domain_name}</td>
                  <td className="mobile-only">{new Date(domain.expiry_date).toLocaleString()}</td>
                  <td className="mobile-only">{domain.organization}</td>
                  <td className="mobile-only">{Array.isArray(domain.server_name) ? domain.server_name.join(', ') : 'N/A'}</td>
                  <td>
                    {editableDomain && editableDomain.id === domain.id ? (
                      <>
                        <input
                          type="text"
                          value={updatedCustomOption}
                          onChange={(e) => setUpdatedCustomOption(e.target.value)}
                        />
                        <button onClick={() => handleSaveClick(domain.domain_name)}>Save</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      domain.custom_option
                    )}
                  </td>
                  <td className="mobile-only" style={{ color: isDomainActive(domain.expiry_date) ? 'green' : 'red' }}>
                    {isDomainActive(domain.expiry_date) ? 'Yes' : 'No'}
                  </td>
                  <td className="mobile-only">{new Date(domain.created_date).toLocaleString()}</td>
                  <td className="mobile-only">{new Date(domain.updated_date).toLocaleString()}</td>
                  <td className="mobile-only">
  <button onClick={() => handleDelete(domain.domain_name)} className="delete-button">
    <img 
      src="https://img.icons8.com/ios/50/000000/trash.png" // Example trash icon URL
      alt="Delete"
      className="action-icon"
    />
  </button>
  <button onClick={() => handleEditClick(domain)} className="edit-button">
    <img 
      src="https://img.icons8.com/ios/50/000000/edit.png" // Example edit icon URL
      alt="Edit"
      className="action-icon"
    />
  </button>
</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
           {/* Mobile Table */}
           <table className="domain-table mobile-table">
            <thead>
              <tr>
                <th>Domain</th>
              
                <th>More Info</th>
              </tr>
            </thead>
            <tbody>
              {filteredDomains.map((domain) => (
                <tr key={domain.id}>
                  <td>{domain.domain_name}</td>
                  
                    <td>
                    <button onClick={() => handleShowMoreInfo(domain)} className="more-info-button">
                      <img
                      src = "https://banner2.cleanpng.com/20180518/uth/avq556ezy.webp"
                      class = 'action-icon'
                      ></img>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        
        
     

      
{/* More Info Modal */}
{showMoreInfoModal && selectedDomain && (
  <div className="modal-backdrop" onClick={handleCloseMoreInfoModal}>
    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        <button className="close-modal-btn" onClick={handleCloseMoreInfoModal}>
          &times;
        </button>
        <h2>More Info for {selectedDomain.domain_name}</h2>
        <p><strong>Domain Name:</strong> {selectedDomain.domain_name}</p>
        <p><strong>Expiry Date:</strong> {new Date(selectedDomain.expiry_date).toLocaleString()}</p>
        <p><strong>Organization:</strong> {selectedDomain.organization}</p>
        <p><strong>Server Names:</strong> {Array.isArray(selectedDomain.server_name) ? selectedDomain.server_name.join(', ') : 'N/A'}</p>

        {/* Editable Custom Option */}
        <p><strong>Custom Option:</strong> 
          {isEditing ? (
            <>
              <input 
                type="text" 
                value={editableCustomOption} 
                onChange={(e) => setEditableCustomOption(e.target.value)} 
                className="editable-input" 
              />
              <div className="modal-actions">
                <button 
                  className="sv-button"
                  onClick={() => {
                    handleSave(selectedDomain.domain_name); // Save updated custom_option
                    setIsEditing(false);  // Disable editing mode
                    handleCloseMoreInfoModal(); // Close the modal after save
                  }}
                >
                  Save
                </button>
                <button 
                  className="cl-button"
                  onClick={() => {
                    setIsEditing(false); // Disable editing mode
                    setEditableCustomOption(selectedDomain.custom_option); // Reset value
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            selectedDomain.custom_option
          )}
        </p>

        <p><strong>Created Date:</strong> {new Date(selectedDomain.created_date).toLocaleString()}</p>
        <p><strong>Updated Date:</strong> {new Date(selectedDomain.updated_date).toLocaleString()}</p>

        <div className="modal-actions">
          {/* Update Button */}
          {!isEditing ? (
            <button 
              className="udt-button"
              onClick={() => {
                setIsEditing(true);  // Enable editing mode
                setEditableCustomOption(selectedDomain.custom_option);  // Load current custom_option for editing
              }}
            >
              Update
            </button>
          ) : null}

          {/* Delete Button */}
          <button 
            className="dlt-button"
            onClick={() => {
              handleDelete(selectedDomain.domain_name); // Handle delete action
              handleCloseMoreInfoModal(); // Close the modal
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {showAddDomainModal && (
        <>
          <div className="modal-backdrop" onClick={handleCloseAddDomainModal}></div>
          <div className="modal-container">
            <div className="modal-content">
              <button className="close-modal-btn" onClick={handleCloseAddDomainModal}>
                &times;
              </button>
              <center>
                <h2 style = {{color: '#75c4e0'}}>Add Domain</h2>
              </center>
              <AddDomainForm onDomainAdded={handleDomainAdded} />
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default DomainList;
