import React, { useEffect, useState } from 'react';
import { getPatientAssessments } from '../../services/assessmentService';
import './User.css'

const TestHistory = ({ patient }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (patient) {
        try {
          const pId = patient.id || patient._id;
          const res = await getPatientAssessments(pId);
          if (res.success) {
            setHistory(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch history", error);
        }
      }
    };
    fetchHistory();
  }, [patient]);

  if (!patient) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--c4)' }}>
        <p>Please select a family member to view their test history.</p>
      </div>
    );
  }
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--green)';
    if (score >= 60) return 'var(--amber)';
    return 'var(--red)';
  };

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
            {history.length > 0 ? history.map((record) => (
              <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 500 }}>
                  {new Date(record.createdAt).toLocaleDateString()}
                </td>
                <td style={{ 
                  padding: '12px 14px', 
                  fontWeight: 700, 
                  color: getScoreColor(record.score) 
                }}>
                  {record.score}/100
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {renderRiskBadge(record.riskLevel)}
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--slate-4)' }}>
                  ~10 min
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button className="btn btn-s btn-sm">View</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--c4)' }}>
                  No test history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestHistory;