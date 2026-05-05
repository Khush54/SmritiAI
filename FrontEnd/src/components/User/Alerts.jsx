import React from 'react';
import './User.css'
const Alerts = ({ alertsData = [], setPage, setSelectedPatient, patients = [] }) => {
  
  const getAlertStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'critical': return { icon: '🚨', class: 'b-red', border: 'var(--rose)' };
      case 'warning':  return { icon: '⚠️', class: 'b-amber', border: 'var(--warm)' };
      case 'success':  return { icon: '✅', class: 'b-green', border: 'var(--sage)' };
      default:         return { icon: 'ℹ️', class: 'b-blue', border: 'var(--sky)' };
    }
  };

  const handleView = (alert) => {
    const targetPatient = patients.find(p => p.id === alert.patientId);
    if (targetPatient) {
      setSelectedPatient(targetPatient);
      setPage(alert.type === 'critical' ? 'reports' : 'patients');
    }
  };

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Family Alerts 🔔</h1>
            <p>Real-time health updates for your family members.</p>
          </div>
          {alertsData.length > 0 && (
            <button className="btn btn-s btn-sm">Mark All Read</button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="alerts-list">
          {alertsData.length > 0 ? (
            alertsData.map((alert) => {
              const style = getAlertStyle(alert.type);
              return (
                <div key={alert.id} className="act-item" style={{ 
                  padding: '16px', 
                  borderBottom: '1px solid var(--c8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  borderLeft: `4px solid ${style.border}` 
                }}>
                  {/* Icon Square */}
                  <div className={`act-ico ${style.class}`} style={{ 
                    minWidth: '42px', height: '42px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                  }}>
                    {style.icon}
                  </div>
                  
                  {/* Content Area */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--c1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {alert.title}
                        <span style={{ 
                          fontSize: '10px', padding: '2px 8px', 
                          background: 'var(--c7)', borderRadius: '100px', color: 'var(--c3)',
                          fontWeight: 500, border: '1px solid var(--c6)'
                        }}>
                          {alert.patientName || 'System'}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--c4)' }}>{alert.time}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--c3)', marginTop: '4px', lineHeight: '1.4' }}>
                      {alert.message}
                    </p>
                  </div>

                  <button 
                    className="btn btn-s btn-sm" 
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => handleView(alert)}
                  >
                    View Details
                  </button>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '50px', marginBottom: '20px' }}>✨</div>
              <h3 style={{ color: 'var(--c1)', marginBottom: '8px' }}>All Clear!</h3>
              <p style={{ color: 'var(--c4)', fontSize: '14px' }}>
                No active alerts or warnings for your family members right now.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;