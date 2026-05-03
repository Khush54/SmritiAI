import React from 'react'
import './Caregiver.css'
function Navbar({setPage}) {
    return (
        <nav className="nav">
            <div className="nav-brand" onClick={() => setPage('home')}>
                <div className="brand-ico">🧠</div>
                <span className="brand-txt">Smriti AI</span>
            </div>
            <span className="nav-role">Caregiver</span>
            <div className="nav-r">
                <div className="notif-btn" onClick={() => setPage('alerts')}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
                </div>
                <div className="nav-pill" onClick={() => setPage('settings')}>
                    <div className="avi">AS</div>
                    <span>Anita Singh</span>
                </div>
            </div>
        </nav>
    )
}

export default Navbar