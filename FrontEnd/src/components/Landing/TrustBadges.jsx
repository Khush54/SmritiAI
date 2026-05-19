import React from 'react';

const BADGES = [
  { icon: 'Lock', title: 'Privacy First', sub: 'Data protected in transit and at rest' },
  { icon: 'Scale', title: 'MMSE / MoCA Inspired', sub: 'Structured around clinical screening domains' },
  { icon: 'Lang', title: '10 Indian Languages', sub: 'Inclusive multilingual screening' },
  { icon: 'Care', title: 'Doctor Portal', sub: 'Assigned doctors can review reports' },
  { icon: 'AI', title: 'Clinician Review Ready', sub: 'AI screening with doctor-facing summaries' },
  { icon: 'Web', title: 'No Download Needed', sub: 'Browser-based SaaS for any device' },
];

function TrustBadges() {
  return (
    <div className="trust-section">
      <div className="trust-label">Why Trust Smriti AI</div>
      <div className="trust-grid">
        {BADGES.map((b, i) => (
          <div className="trust-badge" key={i}>
            <div className="trust-icon">{b.icon}</div>
            <div>
              <div className="trust-title">{b.title}</div>
              <div className="trust-sub">{b.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrustBadges;
