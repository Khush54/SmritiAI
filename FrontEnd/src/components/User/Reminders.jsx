import React from 'react';
import './User.css'

function Reminders({ patient }) {
  if (!patient) {
    return (
      <div className="card" style={{ 
        textAlign: 'center', 
        padding: '40px 20px', 
        color: 'var(--c4)',
        background: 'var(--surface)',
        borderRadius: 'var(--r16)',
        border: '1px solid var(--c7)'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>👤</div>
        <p>Please select a family member to view their AI recommendations.</p>
      </div>
    );
  }

  const recs = patient.recommendations || [];

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>AI Recommendations 📋</h1>
            <p>Personalised care suggestions for <strong>{patient.name}</strong> based on their assessments</p>
          </div>
        </div>
      </div>

      {recs.length === 0 ? (
        <div className="card" style={{
          textAlign: 'center', padding: '60px 20px',
          border: '1px dashed var(--c7)', background: 'var(--surface)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ color: 'var(--c1)', marginBottom: '8px' }}>No Recommendations Yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--c4)', maxWidth: '360px', margin: '0 auto' }}>
            Complete a cognitive assessment for <strong>{patient.name}</strong> to receive personalised AI-generated care recommendations.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recs.map((r, idx) => (
            <div 
              key={idx} 
              className="card"
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '16px', 
                borderLeft: `4px solid ${r.color || 'var(--c5)'}`,
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: (r.color || 'var(--blue)') + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px'
              }}>
                {r.icon || '📍'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  color: r.color || 'var(--c3)', 
                  marginBottom: '4px', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {r.priority || 'General'}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--c2)', lineHeight: '1.6' }}>
                  {r.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reminders;