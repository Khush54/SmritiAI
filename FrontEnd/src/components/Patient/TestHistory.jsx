import React from 'react';

const TestHistory = ({ scoreHistory = [] }) => {
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--green)';
    if (score >= 60) return 'var(--amber)';
    return 'var(--red)';
  };

  // Helper to render the badge based on risk level
  const renderRiskBadge = (risk) => {
    const riskClass = {
      'Low': 'b-green',
      'Moderate': 'b-amber',
      'High': 'b-red'
    }[risk] || 'b-gray';

    return <span className={`badge ${riskClass}`}>{risk}</span>;
  };

  return (
    <div className="card">
      <div className="sec-hdr">
        <div className="sec-title">Test History</div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
          <thead>
            <tr>
              {['Date', 'Score', 'Risk', 'Duration', 'Action'].map((header) => (
                <th 
                  key={header}
                  style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    fontSize: '11px',
                    color: 'var(--slate-4)',
                    fontWeight: '600',
                    borderBottom: '2px solid var(--border)',
                    textTransform: 'uppercase',
                    letterSpacing: '.05em'
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scoreHistory.slice().reverse().map((record, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 500 }}>
                  {record.date}
                </td>
                <td style={{ 
                  padding: '12px 14px', 
                  fontWeight: 700, 
                  color: getScoreColor(record.score) 
                }}>
                  {record.score}/100
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {renderRiskBadge(record.risk)}
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--slate-4)' }}>
                  {record.duration || '~11 min'}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button className="btn btn-s btn-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestHistory;