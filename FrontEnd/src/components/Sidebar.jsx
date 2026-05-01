import React from 'react';


const Sidebar = ({ currentPage, setPage }) => {
  const items = [
    { key: 'dashboard', label: 'Overview', icon: '📊' }, 
    { key: 'test', label: 'Start Test', icon: '📝' },
    { key: 'reports', label: 'My Reports', icon: '📁' },
    { key: 'recommendation', label: 'Recommendation', icon: '👨‍⚕️' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];
  const handleLogout = () => {
  localStorage.removeItem('userToken'); 
  setPage('landing'); 
  window.location.reload(); 
};

  return (
    <aside className="sidebar">
      
      {items.map((item) => (
        <div
          key={item.key}
          className={`sidebar-item ${currentPage === item.key ? 'active' : ''}`}
          onClick={() => setPage(item.key)}
        >
          <span className="sidebar-icon">{item.icon}</span>
          <span>{item.label}</span>
          
          {item.key === 'doctor' && item.badge && (
            <span className="sidebar-badge">{item.badge}</span>
          )}
        </div>
      ))}

      <div className="sidebar-section">Account</div>
      <div className="sidebar-item" onClick={handleLogout}>
        <span className="sidebar-icon">🚪</span>
        <span>Logout</span>
      </div>
    </aside>
  );
};

export default Sidebar;