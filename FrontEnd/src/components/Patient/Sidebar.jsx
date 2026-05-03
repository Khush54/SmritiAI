import React from 'react';

const Sidebar = ({ currentPage, setPage }) => {
  // Navigation structure organized by sections
  const menuGroups = [
    {
      title: 'Main',
      items: [
        { key: 'home', label: 'Overview', icon: '🏠' },
        { key: 'test', label: 'Take a Test', icon: '🧪' },
        { key: 'reports', label: 'My Reports', icon: '📊' },
        { key: 'reminders', label: 'Reminders', icon: '⏰' },
        { key: 'history', label: 'Test History', icon: '📅' },
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setPage('landing');
    window.location.reload();
  };

  return (
    <aside className="sidebar" id="sidebar">
      {menuGroups.map((group) => (
        <React.Fragment key={group.title}>
          <div className="sb-section">{group.title}</div>
          {group.items.map((item) => (
            <div
              key={item.key}
              className={`sb-item ${currentPage === item.key ? 'on' : ''}`}
              onClick={() => setPage(item.key)}
            >
              <div className="ico">{item.icon}</div>
              <span>{item.label}</span>
            </div>
          ))}
        </React.Fragment>
      ))}


      {/* Bottom Items */}
      <div 
        className={`sb-item ${currentPage === 'settings' ? 'on' : ''}`} 
        onClick={() => setPage('settings')}
      >
        <div className="ico">⚙️</div>
        <span>Settings</span>
      </div>

      <div className="sb-item" onClick={handleLogout}>
        <div className="ico">🚪</div>
        <span>Logout</span>
      </div>
    </aside>
  );
};

export default Sidebar;