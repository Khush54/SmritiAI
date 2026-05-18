import React, { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import './User.css'

function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AppContext);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const isActive = (path) => location.pathname === `/user/${path}`;

    const navItem = (path, icon, label) => (
        <div
            className="sb-it"
            id={`sb-${path}`}
            onClick={() => { navigate(`/user/${path}`); onClose && onClose(); }}
            style={{
                background: isActive(path) ? 'var(--blue-light)' : 'transparent',
                color: isActive(path) ? 'var(--blue)' : 'inherit',
                fontWeight: isActive(path) ? '600' : '400',
                borderRadius: 'var(--r10)',
                transition: 'all 0.15s'
            }}
        >
            <div className="sico">{icon}</div>{label}
        </div>
    );

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sb-lbl">Monitoring</div>
            {navItem('home', '🏡', 'Family Overview')}
            {navItem('patients', '👥', 'My Patients')}
            {navItem('test', '🧠', 'Start a Test')}

            <div className="sb-lbl" style={{ marginTop: '12px' }}>Tracking</div>
            {navItem('mood', '😊', 'Mood & Behaviour')}
            {navItem('reminders', '📋', 'AI Recommendations')}
            {navItem('history', '📜', 'Test History')}

            <div className="sb-lbl" style={{ marginTop: '12px' }}>Reports</div>
            {navItem('reports', '📊', 'Reports & Trends')}
            {navItem('alerts', '🔔', 'Alerts & Notifications')}
            {navItem('doctor', '👩‍⚕️', 'Doctor Contact')}

            <div className="sb-lbl" style={{ marginTop: '12px' }}>Account</div>
            {navItem('feedback', '💬', 'Share Feedback')}
            {navItem('settings', '⚙️', 'Settings')}

            <div
                className="sb-it"
                id="sb-logout"
                onClick={handleLogout}
                style={{ marginTop: 'auto', color: 'var(--rose)', borderRadius: 'var(--r10)' }}
            >
                <div className="sico">🚪</div>Log Out
            </div>
        </aside>
    )
}

export default Sidebar