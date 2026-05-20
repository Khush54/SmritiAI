import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initials = (name = '') => name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();
const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending';
const scoreColor = (score = 0) => score < 50 ? 'var(--rose)' : score < 75 ? 'var(--amber)' : 'var(--emerald)';
const getId = (item) => item?.id || item?._id;

const Home = ({ dashboard, loading, error, doctor }) => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);
    const patients = dashboard?.patients || [];

    const highPts = patients.filter(p => p.risk === 'High');
    const selectedPatient = patients.find(p => getId(p) === selectedId);
    const stats = [
        { label: 'Assigned Patients', val: patients.length, color: 'var(--cyan)', icon: 'PT', target: 'patients' },
        { label: 'High Risk', val: highPts.length, color: 'var(--rose)', icon: 'HR', target: 'alerts' },
        { label: 'Follow-ups', val: dashboard?.followUps?.length || 0, color: 'var(--amber)', icon: 'FU', target: 'followups' },
        { label: 'Reports', val: dashboard?.reports?.length || 0, color: 'var(--violet)', icon: 'RP', target: 'reports' }
    ];

    if (loading) return <div className="page">Loading assigned care panel...</div>;
    if (error) return <div className="page"><div className="card">{error}</div></div>;

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>Command Centre</h1>
                        <p>
                            {doctor?.name?.toUpperCase()} - {doctor?.specialization?.toUpperCase() || 'DOCTOR'} - {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                        </p>
                    </div>
                    <div className="ph-act" style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-g btn-sm" onClick={() => navigate('/doctor/alerts')}>
                            {highPts.length} Alerts
                        </button>
                        <button className="btn btn-c" onClick={() => navigate('/doctor/patients')}>
                            View Patients
                        </button>
                    </div>
                </div>
            </div>

            <div className="g4" style={{ marginBottom: '24px' }}>
                {stats.map((s) => (
                    <div key={s.label} className="card kpi" onClick={() => navigate(`/doctor/${s.target}`)} style={{ cursor: 'pointer' }}>
                        <div className="kpi-accent" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                        <div className="kpi-val" style={{ color: s.color }}>{s.val}</div>
                        <div className="kpi-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {patients.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                    <h3>No patients assigned yet</h3>
                    <p style={{ color: 'var(--b3)', marginTop: '8px' }}>Patients will appear here only after Smriti AI recommends this doctor from an assessment.</p>
                </div>
            ) : (
                <div className={`g2 ${selectedId ? 'split-view' : ''}`}>
                    <div className="card">
                        <div className="sh">
                            <div>
                                <div className="sh-title">Patient Surveillance</div>
                                <div className="sh-sub">LIVE ASSIGNED PATIENTS</div>
                            </div>
                            <button className="btn btn-g btn-sm" onClick={() => navigate('/doctor/patients')}>Full Directory</button>
                        </div>

                        <div className="tbl-wrap">
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th>Patient Name</th>
                                        <th>Risk Level</th>
                                        <th>Cog. Score</th>
                                        <th>Last Test</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map(p => {
                                        const patientId = getId(p);
                                        return (
                                        <tr key={patientId} style={{ background: selectedId === patientId ? 'var(--navy-2)' : 'transparent' }}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div className="nav-avi" style={{ width: '32px', height: '32px', fontSize: '12px' }}>{initials(p.name)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: 'var(--b1)' }}>{p.name}</div>
                                                        <div style={{ fontSize: '10px', color: 'var(--b4)' }}>{p.city || 'Location pending'} - {p.age}y</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className={`badge ${p.risk === 'High' ? 'br' : p.risk === 'Moderate' ? 'ba' : 'bg'}`}>{p.risk}</span></td>
                                            <td style={{ color: scoreColor(p.score), fontFamily: 'var(--mono)', fontWeight: 600 }}>{p.score ?? 'NA'}</td>
                                            <td style={{ fontSize: '12px', color: 'var(--b2)' }}>{formatDate(p.lastTest)}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="btn btn-g btn-sm" onClick={() => setSelectedId(patientId === selectedId ? null : patientId)}>
                                                    {selectedId === patientId ? 'Close' : 'Quick View'}
                                                </button>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {selectedPatient && (
                        <div className="card page" style={{ borderLeft: `4px solid ${scoreColor(selectedPatient.score)}` }}>
                            <div className="sh">
                                <div className="sh-title">Quick Analysis</div>
                                <button onClick={() => setSelectedId(null)} style={{ color: 'var(--b4)', fontSize: '18px' }}>&times;</button>
                            </div>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div className="nav-avi" style={{ width: '64px', height: '64px', fontSize: '24px', margin: '0 auto 12px' }}>{initials(selectedPatient.name)}</div>
                                <h2 style={{ color: 'var(--b1)' }}>{selectedPatient.name}</h2>
                                <p style={{ color: 'var(--b3)' }}>Patient ID: {getId(selectedPatient)}</p>
                            </div>
                            <div className="g2" style={{ gap: '10px' }}>
                                <div className="card kpi" style={{ padding: '12px' }}>
                                    <div className="kpi-label">Last Test</div>
                                    <div style={{ fontWeight: '600' }}>{formatDate(selectedPatient.lastTest)}</div>
                                </div>
                                <div className="card kpi" style={{ padding: '12px' }}>
                                    <div className="kpi-label">Status</div>
                                    <div style={{ fontWeight: '600', color: selectedPatient.flag ? 'var(--rose)' : 'var(--emerald)' }}>
                                        {selectedPatient.flag ? 'Urgent' : 'Stable'}
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-c" style={{ width: '100%', marginTop: '20px' }} onClick={() => navigate('/doctor/reports')}>
                                Full Clinical Record
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
