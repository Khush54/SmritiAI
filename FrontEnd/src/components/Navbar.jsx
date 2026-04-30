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

          <ul className='nav-links'>
            <li className='nav-link'><a href='#hero'>Home</a></li>
            <li className='nav-link'><a href='#feature'>Features</a></li>
            <li className='nav-link'><a href='#process'>Process</a></li>
          </ul>
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