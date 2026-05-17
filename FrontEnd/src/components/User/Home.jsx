import React from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css'

function Home({ patients = [], selectedPatient, setSelectedPatient }) {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const getScoreColor = (score) => {
    if (score < 50) return "#ef4444";
    if (score < 75) return "#f59e0b";
    return "#10b981";
  };

  const getRiskColor = (risk, score) => {
    if (score === null || score === undefined) return "#a8a29e"; // Gray fallback for unassessed
    if (risk === 'High') return "#ef4444";
    if (risk === 'Moderate' || risk === 'Medium') return "#f59e0b";
    return "#10b981";
  };

  const handleViewProfile = (patient) => {
    setSelectedPatient(patient);
    navigate('/user/reports');
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
          <div className="ph-act" style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-s btn-sm" onClick={() => navigate('/user/patients')}>
              📝 All Patients
            </button>
            <button className="btn btn-p" onClick={() => navigate('/user/alerts')}>
              🔔 View Alerts
            </button>
          </div>
        </div>
      </div>

      <div className="g2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {patients.length > 0 ? (
          patients.map((p) => (
            <div 
              key={p.id} 
              className="card card-hover" 
              onClick={() => setSelectedPatient(p)}
              style={{ 
                transition: 'all 0.2s', 
                borderLeft: `4px solid ${getRiskColor(p.risk, p.score)}`,
                boxShadow: selectedPatient?.id === p.id ? '0 0 0 2px var(--blue), 0 4px 12px rgba(59, 130, 246, 0.2)' : 'var(--shadow)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {selectedPatient?.id === p.id && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: 'var(--blue)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>✓</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${getRiskColor(p.risk, p.score)}, var(--c1))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '18px', fontWeight: 700, flexShrink: 0
                }}>
                  {p.name ? p.name[0] : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--c1)' }}>
                    {p.name} <span style={{ fontSize: '12px', color: 'var(--c4)', fontWeight: 400 }}>({p.relation})</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--c4)' }}>
                    Age {p.age} · {p.location}
                  </div>
                </div>
                <span className="badge" style={{ 
                  fontSize: '10px', 
                  background: getRiskColor(p.risk, p.score) + '22', // Add transparency
                  color: getRiskColor(p.risk, p.score),
                  border: `1px solid ${getRiskColor(p.risk, p.score)}33`
                }}>
                  {p.score === null ? 'Pending' : `${p.risk} Risk`}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                {p.score === null ? (
                  <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '20px', textAlign: 'center', border: '1px dashed var(--c6)' }}>
                    <div style={{ fontSize: '13px', color: 'var(--c3)', fontWeight: 600 }}>Please take an assessment</div>
                    <button 
                      className="btn btn-p btn-sm" 
                      style={{ marginTop: '10px', fontSize: '11px', padding: '6px 12px' }}
                      onClick={() => { setSelectedPatient(p); navigate('/user/test'); }}
                    >
                      Start Test 🚀
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: getScoreColor(p.score) }}>
                        {p.score}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--c4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</div>
                    </div>
                    
                    {p.trend && (
                      <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px' }}>
                          {p.trend?.toLowerCase() === 'declining' ? '📉' : '📈'}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--c4)', textTransform: 'uppercase' }}>{p.trend}</div>
                      </div>
                    )}

                    {p.mood && (
                      <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px' }}>
                          {p.mood}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--c4)', textTransform: 'uppercase' }}>Mood</div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {p.lastTestDate ? (
                <div style={{ 
                  fontSize: '11px', 
                  color: p.lastTestDate === new Date().toLocaleDateString('en-CA') ? 'var(--sage-d)' : 'var(--c3)', 
                  marginBottom: '12px', 
                  borderTop: '1px solid var(--border)', 
                  paddingTop: '10px',
                  fontWeight: p.lastTestDate === new Date().toLocaleDateString('en-CA') ? '700' : '400'
                }}>
                  {p.lastTestDate === new Date().toLocaleDateString('en-CA') ? (
                    <span>✅ Given assessment for today. Come tomorrow!</span>
                  ) : (
                    <span>Last assessment: <b>{p.lastTestDate}</b></span>
                  )}
                </div>
              ) : null}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-s btn-sm" 
                  style={{ flex: 1 }} 
                  onClick={() => handleViewProfile(p)}
                >
                  View Details
                </button>
                <button 
                  className="btn btn-s btn-sm" 
                  onClick={() => { setSelectedPatient(p); navigate('/user/mood'); }}
                >
                  📝 Log
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏘️</div>
            <h3 style={{ color: 'var(--c1)' }}>No Loved Ones Added</h3>
            <p style={{ color: 'var(--c4)', fontSize: '14px' }}>Start by adding a family member to your profile.</p>
            <button className="btn btn-p btn-sm" style={{ marginTop: '15px' }} onClick={() => navigate('/user/patients')}>
               + Add Your First Patient
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;