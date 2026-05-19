import React from 'react';

function Feature() {
  const features = [
    { icon: '🎙️', bg: 'blue', title: 'Voice Analysis', desc: 'Speak a short passage. Our AI analyses speech patterns, pauses, and fluency markers for cognitive decline.' },
    { icon: '🎮', bg: 'teal', title: 'Pattern Grid Game', desc: 'Watch highlighted boxes and tap the same pattern back. Spatial memory, attention, and recall speed are scored.' },
    { icon: '🔢', bg: 'green', title: 'Memory Questions', desc: 'Sequential memory tasks, word recall, and orientation questions mapped to clinical standards.' },
    { icon: '📱', bg: 'amber', title: 'Behaviour Survey', desc: 'Daily routine changes, sleep patterns, and emotional regulation assessed through caregiver input.' },
  ];

  return (
    <div className="section" id='feature'>
      <div className="section-label">What We Test</div>
      
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '8px' }}>
        Multi-Modal Cognitive Assessment
      </h2>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', maxWidth: '520px' }}>
        Four clinically inspired screening tasks that take just 10 minutes, available in your native language.
      </p>

      <div className="feature-grid">
        {features.map((f, index) => (
          <div className="feature-card card-hover" key={index}>
            <div className={`feature-icon ${f.bg}`}>{f.icon}</div>
            
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              {f.title}
            </h3>
            
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feature;
