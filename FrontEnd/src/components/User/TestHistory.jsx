import React, { useEffect, useState } from 'react';
import { getPatientAssessments } from '../../services/assessmentService';
import './User.css'

const TestHistory = ({ patient }) => {
  const [history, setHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

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
                  <button className="btn btn-s btn-sm" onClick={() => setSelectedRecord(record)}>View</button>
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

      {selectedRecord && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setSelectedRecord(null)}
              style={{ 
                position: 'absolute', right: '20px', top: '20px', border: 'none', 
                background: 'none', fontSize: '20px', cursor: 'pointer',
                color: 'var(--c1)' 
              }}
            >✕</button>
            <h2 style={{ marginBottom: '20px' }}>Assessment Report</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--c4)' }}>Date</label>
                <div style={{ fontWeight: '600' }}>{new Date(selectedRecord.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--c4)' }}>Overall Score</label>
                <div style={{ fontWeight: '700', color: getScoreColor(selectedRecord.score) }}>{selectedRecord.score}/100</div>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: 'var(--c4)' }}>Risk Assessment</label>
              <div style={{ marginTop: '5px' }}>{renderRiskBadge(selectedRecord.riskLevel)}</div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}>Patient Responses</h4>
              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedRecord.details && Object.entries(selectedRecord.details).map(([key, val]) => (
                  <div key={key} style={{ background: 'var(--gray-100)', padding: '10px', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--c2)' }}>{key}:</span> {val}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestHistory;