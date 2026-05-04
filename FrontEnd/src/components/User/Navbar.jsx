import React from 'react'
import './Caregiver.css'

function Navbar({ setPage, caregiverName = "Anita Singh", alertCount = 0 }) {
    return (
        <nav className="nav">
            <div className="nav-brand" onClick={() => setPage('home')} style={{ cursor: 'pointer' }}>
                <div className="brand-ico">🧠</div>
                <span className="brand-txt">Smriti AI</span>
            </div>

            <span className="nav-role">Caregiver Portal</span>

            <div className="nav-r">
                <div className="notif-btn" onClick={() => setPage('alerts')} style={{ position: 'relative' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                    {alertCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            background: 'var(--rose)',
                            color: 'white',
                            fontSize: '10px',
                            borderRadius: '50%',
                            padding: '2px 5px',
                            fontWeight: '700',
                            border: '2px solid var(--surface)'
                        }}>
                            {alertCount}
                        </span>
                    )}
                </div>

                <div className="nav-pill" onClick={() => setPage('settings')}>
                    <div className="avi" style={{ background: 'var(--c1)', color: 'white' }}>
                        {caregiverName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{caregiverName}</span>
                </div>
            </div>
        </nav>
    )
}

export default Navbar