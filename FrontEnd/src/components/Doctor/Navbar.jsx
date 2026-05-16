import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Doctor.css';

const Navbar = ({ user, onSearch }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <div className="nav-brand" onClick={() => navigate('/doctor/home')}>
          <div className="brand-mark">🧠</div>
          <span className="brand-name">Smriti AI</span>
        </div>

        <span className="nav-badge">{user?.portalType}</span>
      </div>

      <div className="nav-search-box">
        <svg className="search-icon" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>

        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="nav-right">
        <div className="nav-icon" onClick={() => navigate('/doctor/alerts')}>
          <svg viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          {user?.hasNotifications && <span className="dot"></span>}
        </div>

        <div className="nav-user" onClick={() => navigate('/doctor/settings')}>
          <div className="nav-avi">{user?.initials}</div>

          <div>
            <div className="nav-uname">{user?.name}</div>
            <div className="nav-urole">{user?.role}</div>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;