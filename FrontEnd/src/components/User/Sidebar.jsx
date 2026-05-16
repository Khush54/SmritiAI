import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import './User.css'

function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useContext(AppContext);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <aside className="sidebar">
            <div className="sb-lbl">Monitoring</div>
            <div className="sb-it" onClick={() => navigate('/user/home')} id="sb-home"><div className="sico">🏡</div>Family Overview</div>
            <div className="sb-it" onClick={() => navigate('/user/patients')} id="sb-patients"><div className="sico">👥</div>My Patients</div>
            <div className="sb-it" onClick={() => navigate('/user/test')} id="sb-test"><div className="sico">🧠</div>Start a Test</div>
            <div className="sb-it" onClick={() => navigate('/user/reminders')} id="sb-reminders"><div className="sico">⏰</div>Reminders</div>
            <div className="sb-it" onClick={() => navigate('/user/alerts')} id="sb-alerts"><div className="sico">🔔</div>Alerts &amp; Notifications</div>
            <div className="sb-it" onClick={() => navigate('/user/reports')} id="sb-reports"><div className="sico">📊</div>Reports &amp; Trends</div>
            <div className="sb-it" onClick={() => navigate('/user/history')} id="sb-history"><div className="sico">📜</div>Test History</div>
            <div className="sb-it" onClick={() => navigate('/user/mood')} id="sb-mood"><div className="sico">😊</div>Mood &amp; Behaviour</div>
            <div className="sb-it" onClick={() => navigate('/user/doctor')} id="sb-doctor"><div className="sico">👩‍⚕️</div>Doctor Contact</div>
            <div className="sb-it" onClick={() => navigate('/user/settings')} id="sb-settings"><div className="sico">⚙️</div>Settings</div>
            <div className="sb-it" onClick={handleLogout} id="sb-logout"><div className="sico">🚪</div>Log Out</div>
        </aside>
    )
}

export default Sidebar