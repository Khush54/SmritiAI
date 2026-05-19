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
    if (score === null || score === undefined) return "#a8a29e";
    if (risk === 'High') return "#ef4444";
    if (risk === 'Moderate' || risk === 'Medium') return "#f59e0b";
    return "#10b981";
  };

  const handleViewProfile = (patient) => {
    setSelectedPatient(patient);
    navigate('/user/reports');
  };

  if (patients.length === 0) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-row">
            <div>
              <h1>Welcome to Smriti AI 👋</h1>
              <p>Let's get you set up in 3 simple steps</p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, var(--blue), #0d9488)',
          borderRadius: 'var(--r16)',
          padding: '32px',
          color: '#fff',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '120px', opacity: 0.08 }}>🧠</div>
          <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.8, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Getting Started</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>You're ready to protect your family's cognitive health.</h2>
          <p style={{ opacity: 0.9, lineHeight: '1.6', maxWidth: '540px', fontSize: '14px' }}>
            Smriti AI helps you monitor early-stage dementia risk for your loved ones with 10-minute daily assessments in 10 Indian languages.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { n: '01', icon: '👤', title: 'Add a Family Member', desc: 'Create a profile for the person you are caring for — their name, age, and relation.', action: 'Add Patient', route: 'patients', color: 'var(--blue)' },
            { n: '02', icon: '🧠', title: 'Take the First Assessment', desc: 'Run the 10-minute 4-part cognitive screening — voice, pattern grid, memory & behaviour.', action: 'Start Test', route: 'test', color: 'var(--teal)' },
            { n: '03', icon: '📊', title: 'Review Their Report', desc: 'Get a colour-coded risk score, AI care recommendations, and doctor referral when needed.', action: 'View Reports', route: 'reports', color: '#7c3aed' },
          ].map((step, i) => (
            <div key={i} className="card card-hover" style={{ borderTop: `3px solid ${step.color}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: step.color, opacity: .1, position: 'absolute', top: '-6px', right: '10px', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>{step.n}</div>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{step.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: step.color, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Step {step.n}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: 'var(--c1)' }}>{step.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--c4)', lineHeight: '1.6', marginBottom: '16px' }}>{step.desc}</p>
              <button className="btn btn-s btn-sm" onClick={() => navigate(`/user/${step.route}`)} style={{ color: step.color }}>
                {step.action} →
              </button>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '16px 20px',
          border: '1px solid var(--c7)', display: 'flex', gap: '12px', alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <div style={{ fontSize: '13.5px', color: 'var(--c3)', lineHeight: '1.6' }}>
            <strong>Tip:</strong> You can add multiple family members and monitor each of them separately. Each person gets their own test history, mood logs, and AI recommendations.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Family Overview 🏡</h1>
            <p>Monitoring {patients.length} loved one{patients.length !== 1 ? 's' : ''} · {today}</p>
          </div>
          <div className="ph-act" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-s btn-sm" onClick={() => navigate('/user/patients')}>
              📝 All Patients
            </button>
            <button className="btn btn-p" onClick={() => navigate('/user/alerts')}>
              🔔 View Alerts
            </button>
          </div>
        </div>
      </div>

      <div className="g2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
        {patients.map((p) => (
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
                position: 'absolute', top: '-10px', right: '-10px',
                background: 'var(--blue)', color: 'white', borderRadius: '50%',
                width: '24px', height: '24px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
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
                <div style={{ fontSize: '12px', color: 'var(--c4)' }}>Age {p.age} · {p.location}</div>
              </div>
              <span className="badge" style={{ 
                fontSize: '10px', 
                background: getRiskColor(p.risk, p.score) + '22',
                color: getRiskColor(p.risk, p.score),
                border: `1px solid ${getRiskColor(p.risk, p.score)}33`
              }}>
                {p.score === null ? 'Pending' : `${p.risk} Risk`}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {p.score === null ? (
                <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '20px', textAlign: 'center', border: '1px dashed var(--c6)' }}>
                  <div style={{ fontSize: '13px', color: 'var(--c3)', fontWeight: 600 }}>Please take an assessment</div>
                  <button 
                    className="btn btn-p btn-sm" 
                    style={{ marginTop: '10px', fontSize: '11px', padding: '6px 12px' }}
                    onClick={(e) => { e.stopPropagation(); setSelectedPatient(p); navigate('/user/test'); }}
                  >
                    Start Test 🚀
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: getScoreColor(p.score) }}>{p.score}%</div>
                    <div style={{ fontSize: '10px', color: 'var(--c4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</div>
                  </div>
                  {p.trend && (
                    <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px' }}>{p.trend?.toLowerCase() === 'declining' ? '📉' : '📈'}</div>
                      <div style={{ fontSize: '10px', color: 'var(--c4)', textTransform: 'uppercase' }}>{p.trend}</div>
                    </div>
                  )}
                  {p.mood && (
                    <div style={{ flex: 1, background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px' }}>{p.mood}</div>
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
                  <span>✅ Assessment given today. Come back tomorrow!</span>
                ) : (
                  <span>Last assessment: <b>{p.lastTestDate}</b></span>
                )}
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-s btn-sm" 
                style={{ flex: 1 }} 
                onClick={(e) => { e.stopPropagation(); handleViewProfile(p); }}
              >
                View Details
              </button>
              <button 
                className="btn btn-s btn-sm" 
                onClick={(e) => { e.stopPropagation(); setSelectedPatient(p); navigate('/user/mood'); }}
              >
                📝 Log
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
