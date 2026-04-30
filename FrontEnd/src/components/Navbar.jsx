import React, { useState } from 'react';

function Navbar({ setPage }) {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="app-nav">

        <div className="nav-brand" onClick={() => setPage('landing')}>
          <div className="brain-icon">🧠</div>
          Smriti AI
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✖' : '☰'}
        </button>

        <div className={`nav-right ${menuOpen ? 'open' : ''}`}>

          <button className="btn btn-secondary btn-md" onClick={() => setPage('auth')}>
            Sign In
          </button>


          <button className="btn btn-primary btn-md" onClick={() => setPage('auth')}>
            Get Started
          </button>
        </div>
      </nav>

    </>
  );
}

export default Navbar;