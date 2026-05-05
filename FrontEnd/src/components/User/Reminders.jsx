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
    <div className="card" style={{ 
      background: 'var(--surface)', 
      padding: '20px', 
      borderRadius: 'var(--r16)', 
      border: '1px solid var(--c7)' 
    }}>
      <div style={{ 
        fontWeight: '600', 
        fontSize: '15px', 
        marginBottom: '18px', 
        color: 'var(--c1)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '18px' }}>📋</span> AI Recommendations for {patient.name}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {recs.length > 0 ? (
          recs.map((r, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '12px', 
                padding: '14px', 
                background: 'var(--c8)', 
                borderRadius: 'var(--r10)', 
                borderLeft: `4px solid ${r.color || 'var(--c5)'}`,
              }}
            >
              <span style={{ fontSize: '20px' }}>{r.icon || '📍'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  color: r.color || 'var(--c3)', 
                  marginBottom: '2px', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {r.priority || 'General'}
                </div>
                <div style={{ 
                  fontSize: '13.5px', 
                  color: 'var(--c2)', 
                  lineHeight: '1.5' 
                }}>
                  {r.text}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: 'var(--c4)', 
            fontSize: '13px',
            border: '1px dashed var(--c7)',
            borderRadius: 'var(--r10)'
          }}>
            No specific recommendations generated yet. Complete a test to see insights.
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;