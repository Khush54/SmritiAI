import React from 'react';

const BADGES = [
  { icon: '🔒', title: 'HIPAA Safe', sub: 'Data encrypted at rest & in transit' },
  { icon: '🧬', title: 'MMSE / MoCA Aligned', sub: 'Built on validated clinical scales' },
  { icon: '🌐', title: '10 Indian Languages', sub: 'Inclusive multilingual screening' },
  { icon: '🏥', title: '50+ Neurology Partners', sub: 'Trusted by certified neurologists' },
  { icon: '🤖', title: '93% AI Accuracy', sub: 'Validated in 3-centre pilot study' },
  { icon: '⚡', title: 'No Download Needed', sub: 'Fully browser-based, works on any device' },
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
