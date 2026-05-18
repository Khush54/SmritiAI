import React, { useEffect, useState } from 'react';
import { getPatientAssessments } from '../../services/assessmentService';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';
import './User.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TestHistory = ({ patient }) => {
  const [history, setHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!patient) return;
      try {
        const pId = patient.id || patient._id;
        if (!pId) return;

        const res = await getPatientAssessments(pId);
        if (res && res.success) {
          setHistory(res.data || []);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
        setHistory([]);
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
      
      <div className="history-list">
        {history.length > 0 ? history.map((record) => (
          <div key={record._id || record.id} className="act-it" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{new Date(record.createdAt).toLocaleDateString()}</div>
              <div style={{ fontSize: '12px', color: 'var(--c4)' }}>Duration: ~10 min</div>
            </div>
            <div style={{ fontWeight: 700, color: getScoreColor(record.score) }}>
              Score: {record.score}/100
            </div>
            <div>
              {renderRiskBadge(record.riskLevel)}
            </div>
            <button className="btn btn-s btn-sm" onClick={() => setSelectedRecord(record)}>View</button>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--c4)' }}>
            No test history found.
          </div>
        )}
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
              <h4 style={{ marginBottom: '15px' }}>Cognitive Breakdown</h4>
              <div style={{ height: '200px', marginBottom: '20px' }}>
                {selectedRecord.details?.aiReport?.breakdown ? (
                  <Bar 
                    data={{
                      labels: ['Memory', 'Language', 'Attention', 'Spatial', 'Logic', 'Behavior'],
                      datasets: [{
                        label: 'Score %',
                        data: [
                          selectedRecord.details.aiReport.breakdown.memory || 0,
                          selectedRecord.details.aiReport.breakdown.language || 0,
                          selectedRecord.details.aiReport.breakdown.attention || 0,
                          selectedRecord.details.aiReport.breakdown.spatial || 0,
                          selectedRecord.details.aiReport.breakdown.logic || 0,
                          selectedRecord.details.aiReport.breakdown.behavior || 0
                        ],
                        backgroundColor: 'rgba(37, 99, 235, 0.6)',
                        borderColor: '#2563EB',
                        borderWidth: 1,
                      }]
                    }} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { beginAtZero: true, max: 100 }
                      },
                      plugins: { legend: { display: false } }
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--c4)', paddingTop: '40px' }}>
                    No granular breakdown available for this record.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestHistory;