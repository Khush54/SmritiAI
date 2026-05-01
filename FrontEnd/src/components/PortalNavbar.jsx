import React from 'react'

function PortalNavbar({ setPage }) {
    return (
        <>
            <nav className="app-nav">
                <div className="nav-brand" onClick={() => setPage('landing')}>
                    <div className="brain-icon">🧠</div>
                    Smriti AI
                </div>
                <div className="navportal-right">
                    <button className="btn btn-ghost btn-sm" style={{ position: 'relative' }}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg></button>
                    <div className="avatar" onClick={() => setPage('settings')}>RK</div>
                </div>
            </nav>

        </>
    )
}

export default PortalNavbar