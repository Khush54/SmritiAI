import React, { useState, useEffect } from 'react';
import './Doctor.css'
function Patients() {
    const [patients, setPatients] = useState([]);
    const [riskFilter, setRiskFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null); 
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('/api/patients');
                const data = await response.json();
                setPatients(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setPatients([
                    { id: 1, name: "Anita Rao", age: 62, gender: "F", risk: "High", score: 42, city: "Delhi", tests: 12, caregiver: "Dr. Verma", lastTest: "12 Dec", followUp: "28 Dec", flag: true, trend: 'down' },
                    { id: 2, name: "Suresh Gupta", age: 71, gender: "M", risk: "High", score: 38, city: "Mumbai", tests: 8, caregiver: "Dr. Kapoor", lastTest: "15 Dec", followUp: "30 Dec", flag: false, trend: 'down' },
                    { id: 3, name: "Meera Singh", age: 55, gender: "F", risk: "Medium", score: 65, city: "Noida", tests: 5, caregiver: "Dr. Verma", lastTest: "20 Dec", followUp: "05 Jan", flag: true, trend: 'up' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filtered = riskFilter === 'all' ? patients : patients.filter(p => p.risk === riskFilter);
    const getScoreColor = (s) => s < 50 ? '#F43F5E' : '#10B981';

    if (loading) return <div className="page" style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><div className="loader">Syncing Clinical Records...</div></div>;

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '--b1' }}>Patient Directory</h1>
                        <p style={{ color: 'var(--b3)', fontSize: '11px', letterSpacing: '0.5px', marginTop: '4px' }}>
                            {patients.length} TOTAL · {filtered.length} FILTERED
                        </p>
                    </div>
                    <div className="ph-act">
                        {['all', 'High', 'Medium', 'Low'].map(f => (
                            <button
                                key={f}
                                className={`chip ${riskFilter === f ? 'on' : ''}`}
                                onClick={() => setRiskFilter(f)}
                                style={{ cursor: 'pointer', transition: '0.2s' }}
                            >
                                {f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="g3" style={{ marginBottom: '24px' }}>
                {[
                    { label: 'High Risk', count: patients.filter(p => p.risk === 'High').length, color: '#F43F5E' },
                    { label: 'Medium Risk', count: patients.filter(p => p.risk === 'Medium').length, color: '#F59E0B' },
                    { label: 'Low Risk', count: patients.filter(p => p.risk === 'Low').length, color: '#10B981' }
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: `3px solid ${stat.color}` }}>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color, fontFamily: 'var(--mono)' }}>{stat.count}</div>
                        <div style={{ fontSize: '10px', color: 'var(--b4)', textTransform: 'uppercase', fontWeight: '600' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="tbl-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                {['Patient', 'Age/Sex', 'Risk', 'Score', 'Trend', 'Caregiver', 'Follow-up', 'Action'].map(h => (
                                    <th key={h} style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--b4)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} style={{ transition: 'background 0.2s' }}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="avatar-small">
                                                {p.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--b2)', fontSize: '13px' }}>{p.name}</div>
                                                <div style={{ fontSize: '10px', color: 'var(--b4)' }}>{p.city} · {p.tests} Tests</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>{p.age}y / {p.gender}</td>
                                    <td>
                                        <span className={`badge ${p.risk === 'High' ? 'br' : p.risk === 'Medium' ? 'ba' : 'bg'}`}>
                                            {p.risk}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: getScoreColor(p.score) }}>{p.score}</div>
                                        <div className="prog-t" style={{ width: '40px' }}><div className="prog-f" style={{ width: `${p.score}%`, background: getScoreColor(p.score) }}></div></div>
                                    </td>
                                    <td style={{ color: p.trend === 'up' ? '#10B981' : '#F43F5E' }}>
                                        {p.trend === 'up' ? '▲' : '▼'}
                                    </td>
                                    <td style={{ fontSize: '12px', color: 'var(--b3)' }}>{p.caregiver}</td>
                                    <td style={{ fontSize: '11px', color: p.flag ? '#F59E0B' : 'var(--b4)' }}>{p.followUp}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-g btn-sm" onClick={() => setSelectedPatient(p)}>Report</button>
                                            <button className="btn btn-v btn-sm" onClick={() => alert(`Opening notes for ${p.name}`)}>Note</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedPatient && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '400px', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setSelectedPatient(null)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--b2)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
                        <h2 style={{ marginBottom: '10px' }}>{selectedPatient.name}</h2>
                        <p style={{ color: 'var(--b3)', fontSize: '12px' }}>Clinical Report Summary</p>
                        <hr style={{ margin: '20px 0', borderColor: 'var(--navy-3)' }} />
                        <div className="g2">
                            <div className="card kpi"><div className="kpi-label">Score</div><div className="kpi-val">{selectedPatient.score}</div></div>
                            <div className="card kpi"><div className="kpi-label">Status</div><div className="kpi-val" style={{ color: getScoreColor(selectedPatient.score) }}>{selectedPatient.risk}</div></div>
                        </div>
                        <button className="btn btn-c" style={{ width: '100%', marginTop: '20px' }} onClick={() => setSelectedPatient(null)}>Close Analysis</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;