import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {
  const [selected, setSelected] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showServerOptions, setShowServerOptions] = useState(false);
  const [domains, setDomains] = useState([]);
  const [filteredDomains, setFilteredDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [clickedDomain, setClickedDomain] = useState(null); // New state
  const [hoverPopupVisible, setHoverPopupVisible] = useState(false);
  const [hoverPopupPosition, setHoverPopupPosition] = useState({});
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableCustomOption, setEditableCustomOption] = useState('');
  const [updatedCustomOption, setUpdatedCustomOption] = useState('');
  const [editableDomain, setEditableDomain] = useState(null);
  
  
  const navigate = useNavigate();
  

  useEffect(() => {
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

    fetchDomains();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSelect = (selection, path) => {
    setSelected(selection);
    if (window.innerWidth <= 768) setSidebarOpen(false);
    navigate(path);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleServerOptions = () => {
    setShowServerOptions((prev) => !prev);
  };

  const handleServerClick = (serverName, event) => {
    const filtered = domains.filter(
      (domain) => domain.custom_option?.toLowerCase() === serverName.toLowerCase()
    );
    setFilteredDomains(filtered);

    const { clientX, clientY } = event;
    setPopupPosition({ top: clientY, left: clientX });
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setHoverPopupVisible(false);
    setClickedDomain(null); // Reset clicked domain
  };

  const handleDomainHover = (domain, event) => {
    setHoveredDomain(domain);

    const hoverPopupTop = popupPosition.top + 90;
    const hoverPopupLeft = popupPosition.left;

    setHoverPopupPosition({ top: hoverPopupTop, left: hoverPopupLeft });
    setHoverPopupVisible(true);
  };

  const handleDomainHoverLeave = () => {
    setHoverPopupVisible(false);
  };

  


  const handleDomainClick = (domain) => {
    setSelectedDomain(domain);
    setShowMoreInfoModal(true);
    setSidebarOpen(!isSidebarOpen);
    setPopupVisible(false);
    setHoverPopupVisible(false);
    setClickedDomain(null);
  };

  const handleCloseMoreInfoModal = () => {
    setShowMoreInfoModal(false);
    setIsEditing(false);
    setEditableCustomOption('');
    setSidebarOpen(!isSidebarOpen);
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



  const handleCancelEdit = () => {
    setEditableDomain(null);
  };

  return (
    <div class="side">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <h2 className="sidebar-title" >
        <div className="geeeks ">
          <span>D</span>
          <span>o</span>
          <span>m</span>
          <span>E</span>
          <span>X</span>
        </div>
        </h2>

        <ul className="sidebar-menu">
          <li onClick={() => handleSelect('domains', '/domainlist')}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2235/2235607.png"
              alt="Domains"
              className="sidebar-icon"
            />
            Domains
          </li>

          <li onClick={() => handleSelect('register', '/register')}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3450/3450043.png"
              alt="Domains"
              className="sidebar-icon"
            />
            Add User
          </li>

          <li onClick={toggleServerOptions}>
            <img
              src="https://cdn-icons-png.freepik.com/256/622/622339.png?semt=ais_hybrid"
              alt="Domains"
              className="sidebar-icon"
            />
            Server
            <span className={`arrow ${showServerOptions ? 'rotate' : ''}`}>▶</span>
          </li>

          {showServerOptions && (
            <div className="server-options">
              <ul>
                <li onClick={(e) => handleServerClick('server 1', e)}>Server 1</li>
                <li onClick={(e) => handleServerClick('server 2', e)}>Server 2</li>
                <li onClick={(e) => handleServerClick('server 3', e)}>Server 3</li>
              </ul>
            </div>
          )}
        </ul>
          
      </div>

      {popupVisible && (
        <div
          className="popup"
          style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
        >
          <div className="popup-header">
            
              <h3>Domains (Total: {filteredDomains.length})</h3>
           
            <button className="close-popup" onClick={closePopup}>
              ✖
            </button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : filteredDomains.length > 0 ? (
            <ul className="pop-list">
              {filteredDomains.map((domain) => (
                <li
                  key={domain.id}
                  
                  onMouseLeave={handleDomainHoverLeave}
                  onClick={(e) => handleDomainClick(domain, e)}
                >
                  {domain.domain_name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No domains found for this server.</p>
          )}
        </div>
      )}
{/*
      {(hoverPopupVisible && hoveredDomain) || clickedDomain ? (
        <div
          className="hover-popup"
          style={{ top: `${hoverPopupPosition.top}px`, left: `${hoverPopupPosition.left}px` }}
        ><button className="close-popup" onClick={closePopup}>
        ✖
      </button>
          <center>
            <h4>Domain Details</h4>
            
          </center>
          
          <p><strong>Name:</strong> {clickedDomain?.domain_name || hoveredDomain?.domain_name}</p>
          <p><strong>Organization:</strong> {clickedDomain?.organization || hoveredDomain?.organization}</p>
          <p><strong>Created On:</strong> {clickedDomain?.created_date || hoveredDomain?.created_date}</p>
          <p><strong>Expiry Date:</strong> {clickedDomain?.expiry_date || hoveredDomain?.expiry_date}</p>
        </div>
      ) : null}
    </div>
  );
};*/}
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

    </div>
  );
};

export default Sidebar;
