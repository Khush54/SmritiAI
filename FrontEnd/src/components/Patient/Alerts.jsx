import React from 'react';

const Alerts = ({ alertsData = [] }) => {
  // Helper to determine badge style based on alert type
  const getAlertStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'critical':
        return { icon: '🚨', class: 'b-red' };
      case 'warning':
        return { icon: '⚠️', class: 'b-amber' };
      case 'success':
        return { icon: '✅', class: 'b-green' };
      default:
        return { icon: 'ℹ️', class: 'b-blue' };
    }
  };

  return (
    <div className="page">
      {/* Header Section */}
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Notifications & Alerts</h1>
            <p>Stay updated with your latest health milestones and reminders.</p>
          </div>
          <div className="ph-actions">
            <button className="btn btn-s btn-sm">Mark all as read</button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="card">
        <div className="sec-hdr">
          <div className="sec-title">Recent Activity</div>
        </div>

        <div className="alerts-list">
          {alertsData.length > 0 ? (
            alertsData.map((alert) => {
              const style = getAlertStyle(alert.type);
              return (
                <div key={alert.id} className="act-item">
                  <div className={`act-ico ${style.class}`} style={{ fontSize: '18px' }}>
                    {style.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--slate)' }}>
                        {alert.title}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--slate-4)' }}>
                        {alert.time}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--slate-3)', marginTop: '2px' }}>
                      {alert.message}
                    </p>
                  </div>

                  <button className="btn btn-s btn-sm" style={{ padding: '4px 8px', marginLeft: '10px' }}>
                    View
                  </button>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--slate-4)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔔</div>
              <p>All caught up! No new alerts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;