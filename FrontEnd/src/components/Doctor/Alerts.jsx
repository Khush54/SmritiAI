import React, { useState } from 'react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, pt: "Anita Rao", text: "Cognitive score dropped by 15% in the last 24 hours.", time: "10:42 AM", type: "critical", icon: "🚨" },
    { id: 2, pt: "Suresh Gupta", text: "Missed scheduled daily cognitive game check-in.", time: "09:15 AM", type: "high", icon: "⚠️" },
    { id: 3, pt: "Meera Singh", text: "Patient reported slight disorientation during morning test.", time: "08:30 AM", type: "high", icon: "⚠️" },
    { id: 4, pt: "Rajesh Kumar", text: "Weekly progress report is now ready for review.", time: "07:00 AM", type: "info", icon: "📋" },
    { id: 5, pt: "System Update", text: "Cloud sync completed for all active patient nodes.", time: "01:00 AM", type: "system", icon: "✅" }
  ]);

  const counts = {
    critical: alerts.filter(a => a.type === 'critical').length,
    high: alerts.filter(a => a.type === 'high').length,
    info: alerts.filter(a => a.type === 'info').length,
    system: alerts.filter(a => a.type === 'system').length,
  };

  const handleDismiss = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleMarkAllRead = () => {
    setAlerts([]);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'critical': return 'var(--rose)'; 
      case 'high': return 'var(--amber)';     
      case 'info': return 'var(--cyan)';     
      case 'system': return 'var(--emerald)';   
      default: return 'var(--navy-5)';
    }
  };

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Alerts</h1>
            <p>{alerts.length} UNREAD · SORTED BY PRIORITY</p>
          </div>
          {alerts.length > 0 && (
            <button className="btn btn-g btn-sm" onClick={handleMarkAllRead}>
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="g4" style={{ marginBottom: '16px' }}>
        <div className="card kpi">
          <div className="kpi-val" style={{ color: 'var(--rose)', fontSize: '24px' }}>{counts.critical}</div>
          <div className="kpi-label">Critical</div>
        </div>
        <div className="card kpi">
          <div className="kpi-val" style={{ color: 'var(--amber)', fontSize: '24px' }}>{counts.high}</div>
          <div className="kpi-label">High</div>
        </div>
        <div className="card kpi">
          <div className="kpi-val" style={{ color: 'var(--cyan)', fontSize: '24px' }}>{counts.info}</div>
          <div className="kpi-label">Information</div>
        </div>
        <div className="card kpi">
          <div className="kpi-val" style={{ color: 'var(--emerald)', fontSize: '24px' }}>{counts.system}</div>
          <div className="kpi-label">System</div>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {alerts.length > 0 ? (
          alerts.map((a) => (
            <div 
              key={a.id} 
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                padding: '15px',
                borderRadius: 'var(--r8)',
                background: 'var(--navy-2)', 
                marginBottom: '10px',
                borderLeft: `4px solid ${getTypeColor(a.type)}`,
                border: '1px solid var(--border)',
                borderLeftWidth: '4px'
              }}
            >
              <div style={{ fontSize: '22px', flexShrink: 0 }}>{a.icon}</div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--b2)', marginBottom: '3px' }}>
                  {a.pt}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--b2)', lineHeight: '1.5' }}>
                  {a.text}
                </div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--b4)', marginTop: '5px' }}>
                  {a.time}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', flexShrink: 0 }}>
                <button 
                  className="btn btn-r btn-sm" 
                  style={{ fontSize: '11px', width: '70px' }}
                  onClick={() => handleDismiss(a.id)}
                >
                  Dismiss
                </button>
                <button 
                  className="btn btn-c btn-sm" 
                  style={{ fontSize: '11px', width: '70px' }}
                  onClick={() => alert(`Initiating action for ${a.pt}`)}
                >
                  Action
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--b4)' }}>
             <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
             <p>All clear. No pending alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;