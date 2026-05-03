import React from 'react';

function Home({ patients = [], onNavigate }){
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const getScoreColor = (score) => {
    if (score < 50) return "var(--rose)";
    if (score < 75) return "var(--warm)";
    return "var(--sage)";
  };

  return (
    <div className="page">
      {/* ── HEADER ── */}
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Family Overview 🏡</h1>
            <p>Monitoring {patients.length} loved ones · {today}</p>
          </div>
          <div className="ph-act">
            <button className="btn btn-s btn-sm" onClick={() => onNavigate?.('log')}>
              📝 Add Log Entry
            </button>
            <button className="btn btn-p" onClick={() => onNavigate?.('alerts')}>
              🔔 View Alerts
            </button>
          </div>
        </div>
      </div>

      {/* ── PATIENT GRID ── */}
      <div className="g2">
        {patients.length > 0 ? (
          patients.map((p) => (
            <div key={p.id} className="pat-card" onClick={() => onNavigate?.('patients')}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${p.risk === 'High' ? 'var(--rose), #EF4444' : 'var(--sage), var(--sky)'})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '18px', fontWeight: 700, flexShrink: 0
                }}>
                  {p.name ? p.name[0] : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>
                    {p.name} <span style={{ fontSize: '12px', color: 'var(--c4)', fontWeight: 400 }}>({p.relation})</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--c4)' }}>
                    Age {p.age} · {p.location}
                  </div>
                </div>
                <span className={`badge ${p.risk === 'High' ? 'br' : 'bg'}`}>
                  {p.risk} Risk
                </span>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, color: getScoreColor(p.score) }}>
                    {p.score ?? '--'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c4)', marginTop: '2px' }}>Score / 100</div>
                </div>
                
                <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '17px', marginBottom: '2px' }}>
                    {p.trend === 'declining' ? '📉' : '📊'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c4)', textTransform: 'capitalize' }}>{p.trend}</div>
                </div>

                <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '17px', marginBottom: '2px' }}>
                    {p.mood === 'Irritable' ? '😤' : p.mood === 'Cheerful' ? '😊' : '😐'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c4)' }}>{p.mood}</div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ fontSize: '12px', color: 'var(--c4)', marginBottom: '10px' }}>
                Last test: {p.lastTest} · Dr: {p.doctor}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn-s btn-sm">📊 Report</button>
                {p.risk === 'High' ? (
                  <button className="btn btn-r btn-sm">⚠️ Alert Active</button>
                ) : (
                  <button className="btn btn-sm" style={{ background: 'var(--sage-l)', color: 'var(--sage-d)', borderRadius: 'var(--r10)' }}>
                    ✓ All Good
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏘️</div>
            <h3 style={{ color: 'var(--c1)', marginBottom: '8px' }}>No Loved Ones Added</h3>
            <p style={{ color: 'var(--c4)', fontSize: '14px' }}>Start by adding a family member to monitor their wellbeing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;