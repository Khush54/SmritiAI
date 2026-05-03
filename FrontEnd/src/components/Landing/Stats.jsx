import React from 'react';

function Stats() {
  const stats = [
    { n: '5.3M+', l: 'Dementia patients in India' },
    { n: '90%', l: 'Cases undetected at early stage' },
    { n: '10 Min', l: 'Complete screening time' },
    { n: '93%', l: 'AI detection accuracy (pilot)' },
  ];

  return (
    <div className="stats-section">
      <div className="section-label" style={{ color: 'rgba(255,255,255,.7)' }}>
        The Numbers
      </div>
      
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#fff', marginBottom: '40px' }}>
        Why Early Detection Matters
      </h2>

      <div className="stats-grid">
        {stats.map((s, index) => (
          <div className="stat-item" key={index}>
            <div className="stat-num">{s.n}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;