import React, { useState } from 'react';

const formatTime = (date) => date ? new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Now';

const Alerts = ({ dashboard, loading, error }) => {
  const [dismissed, setDismissed] = useState([]);
  const alerts = (dashboard?.alerts || []).filter(alert => !dismissed.includes(alert.id));

  const counts = {
    critical: alerts.filter(a => a.type === 'critical').length,
    high: alerts.filter(a => a.type === 'high').length,
    info: alerts.filter(a => a.type === 'info').length,
    system: alerts.filter(a => a.type === 'system').length,
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

  if (loading) return <div className="page">Loading assigned alerts...</div>;
  if (error) return <div className="page"><div className="card">{error}</div></div>;

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Alerts</h1>
            <p>{alerts.length} UNREAD - ASSIGNED PATIENTS ONLY</p>
          </div>
          {alerts.length > 0 && (
            <button className="btn btn-g btn-sm" onClick={() => setDismissed(alerts.map(alert => alert.id))}>
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="g4" style={{ marginBottom: '16px' }}>
        <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--rose)', fontSize: '24px' }}>{counts.critical}</div><div className="kpi-label">Critical</div></div>
        <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--amber)', fontSize: '24px' }}>{counts.high}</div><div className="kpi-label">High</div></div>
        <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--cyan)', fontSize: '24px' }}>{counts.info}</div><div className="kpi-label">Information</div></div>
        <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--emerald)', fontSize: '24px' }}>{counts.system}</div><div className="kpi-label">System</div></div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {alerts.length > 0 ? alerts.map((alert) => (
          <div key={alert.id} className="alert-item" style={{
            display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '15px',
            borderRadius: 'var(--r8)', background: 'var(--navy-2)', marginBottom: '10px',
            border: '1px solid var(--border)', borderLeft: `4px solid ${getTypeColor(alert.type)}`
          }}>
            <div style={{ fontSize: '22px', flexShrink: 0 }}>{alert.type === 'critical' ? '!' : 'i'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--b2)', marginBottom: '3px' }}>{alert.pt}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--b2)', lineHeight: '1.5' }}>{alert.text}</div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--b4)', marginTop: '5px' }}>{formatTime(alert.time)}</div>
            </div>
            <button className="btn btn-r btn-sm" style={{ fontSize: '11px', width: '70px' }} onClick={() => setDismissed(prev => [...prev, alert.id])}>
              Dismiss
            </button>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--b4)' }}>
            <p>All clear. No pending alerts for assigned patients.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
