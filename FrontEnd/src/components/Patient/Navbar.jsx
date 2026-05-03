import React from 'react';
import './Patient.css'
function Navbar({ setPage }) {
    return (
        <nav className="nav">
            <div className="nav-logo" onClick={() => setPage('home')} style={{ cursor: 'pointer' }}>
                <div className="logo-orb">🧠</div>
                Smriti AI
            </div>

            <span className="nav-tag">Patient</span>

            <div className="nav-r">
                <div className="nav-notif" onClick={() => setPage('alerts')} style={{ cursor: 'pointer' }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                </div>

                <div className="nav-user" onClick={() => setPage('settings')} style={{ cursor: 'pointer' }}>
                    <div className="user-avi">KK</div>
                    <span className="user-name">Khushpreet Kaur</span>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;