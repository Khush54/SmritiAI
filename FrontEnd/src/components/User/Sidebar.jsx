import React from 'react'

function Sidebar({page,setPage}) {
    const handleLogout = () => {
    localStorage.removeItem('userToken');
    setPage('landing');
    window.location.reload();
  };
    return (
        <aside className="sidebar">
            <div className="sb-lbl">Monitoring</div>
            <div className="sb-it " onClick={()=> setPage('home')} id="sb-home"><div className="sico">🏡</div>Family Overview</div>
            <div className="sb-it" onClick={()=> setPage('patients')} id="sb-patients"><div className="sico">👥</div>My Patients</div>
            <div className="sb-it" onClick={()=> setPage('test')} id="sb-patients"><div className="sico">🧠</div>Start a Test</div>
            <div className="sb-it" onClick={()=> setPage('reminders')} id="sb-patients"><div className="sico">⏰</div>Reminders</div>
            <div className="sb-it" onClick={()=> setPage('alerts')} id="sb-alerts"><div className="sico">🔔</div>Alerts &amp; Notifications</div>
            <div className="sb-it" onClick={()=> setPage('reports')}id="sb-reports"><div className="sico">📊</div>Reports &amp; Trends</div>
            <div className="sb-it" onClick={()=> setPage('history')}id="sb-reports"><div className="sico">📜</div>Test History</div>
            <div className="sb-it" onClick={()=> setPage('mood')}id="sb-mood"><div className="sico">😊</div>Mood &amp; Behaviour</div>
            <div className="sb-it" onClick={()=> setPage('doctor')} id="sb-doctor"><div className="sico">👩‍⚕️</div>Doctor Contact</div>
            <div className="sb-it" onClick={()=> setPage('settings')} id="sb-settings"><div className="sico">⚙️</div>Settings</div>
            <div className="sb-it" onClick={handleLogout} id="sb-settings"><div className="sico">🚪</div>Log Out</div>
        </aside>
    )
}

export default Sidebar