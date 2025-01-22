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
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const navigate = useNavigate();

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
        `https://flask-backend-alpha.vercel.app/api/domain/${domainName}`, // Update URL to use domain_name
        {
          custom_option: updatedCustomOption,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setDomains((prevDomains) =>
          prevDomains.map((domain) =>
            domain.domain_name === domainName // Use domain_name to compare
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

  const handleCancelEdit = () => {
    setEditableDomain(null);
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  if (loading) return <div>Loading domains...</div>;

  // Filtered domains based on the search term
  const filteredDomains = domains.filter((domain) =>
    (domain.domain_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main">
      <header className="header">
      <div className="geeks">
        <span>D</span>
        <span>o</span>
        <span>m</span>
        <span>E</span>
        <span>X</span>
      </div>
  <img
    src="https://img.icons8.com/?size=100&id=2445&format=png&color=FFFFFF"
    alt="Logo"
    className="header-logo"
    onClick={handleLogoClick}
  />
</header>
      <div className="header-underline"></div>

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
          <table className="domain-table">
            <thead>
              <tr>
                <th>Domain Name</th>
                <th>Expiry Date</th>
                <th>Organization</th>
                <th>Server Names</th>
                <th>Data StoredIn</th>
                <th>Active</th>
                <th>Created Date</th>
                <th>Updated Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDomains.map((domain) => (
                <tr key={domain.id}>
                  <td>{domain.domain_name}</td>
                  <td>{new Date(domain.expiry_date).toLocaleString()}</td>
                  <td>{domain.organization}</td>
                  <td>{Array.isArray(domain.server_name) ? domain.server_name.join(', ') : 'N/A'}</td>
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
                  <td style={{ color: isDomainActive(domain.expiry_date) ? 'green' : 'red' }}>
  {isDomainActive(domain.expiry_date) ? 'Yes' : 'No'}
</td>
                  <td>{new Date(domain.created_date).toLocaleString()}</td>
                  <td>{new Date(domain.updated_date).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleDelete(domain.domain_name)} className="delete-button">
                      Delete
                    </button>
                    <br />
                    <br />
                    <button onClick={() => handleEditClick(domain)} className="edit-button">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddDomainModal && (
        <>
          <div className="modal-backdrop" onClick={handleCloseAddDomainModal}></div>
          <div className="modal-container">
            <div className="modal-content">
              <button className="close-modal-btn" onClick={handleCloseAddDomainModal}>
                &times;
              </button>
              <center>
                <h2>Add Domain</h2>
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
