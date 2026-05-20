import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Doctor.css';

const EMPTY_PATIENTS = [];
const initials = (name = '') => name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();
const getScoreColor = (score = 0) => score < 50 ? '#F43F5E' : score < 75 ? '#F59E0B' : '#10B981';
const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending';
const getId = (item) => item?.id || item?._id;

function Patients({ dashboard, loading, error, searchQuery = '' }) {
    const navigate = useNavigate();
    const [riskFilter, setRiskFilter] = useState('all');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const patients = dashboard?.patients || EMPTY_PATIENTS;

    const filtered = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return patients.filter((patient) => {
            const matchesRisk = riskFilter === 'all' || patient.risk === riskFilter;
            const matchesSearch = !query || [patient.name, patient.city, patient.caregiver, patient.assignedDoctorName]
                .filter(Boolean)
                .some(value => value.toLowerCase().includes(query));
            return matchesRisk && matchesSearch;
        });
    }, [patients, riskFilter, searchQuery]);

    if (loading) return <div className="page">Syncing assigned clinical records...</div>;
    if (error) return <div className="page"><div className="card">{error}</div></div>;

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>Patient Directory</h1>
                        <p>{patients.length} ASSIGNED - {filtered.length} FILTERED</p>
                    </div>
                    <div className="ph-act">
                        {['all', 'High', 'Moderate', 'Low'].map(f => (
                            <button key={f} className={`chip ${riskFilter === f ? 'on' : ''}`} onClick={() => setRiskFilter(f)}>
                                {f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="g3" style={{ marginBottom: '24px' }}>
                {[
                    { label: 'High Risk', count: patients.filter(p => p.risk === 'High').length, color: '#F43F5E' },
                    { label: 'Moderate Risk', count: patients.filter(p => p.risk === 'Moderate').length, color: '#F59E0B' },
                    { label: 'Low Risk', count: patients.filter(p => p.risk === 'Low').length, color: '#10B981' }
                ].map((stat) => (
                    <div key={stat.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: `3px solid ${stat.color}` }}>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color, fontFamily: 'var(--mono)' }}>{stat.count}</div>
                        <div style={{ fontSize: '10px', color: 'var(--b4)', textTransform: 'uppercase', fontWeight: '600' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '44px', color: 'var(--b3)' }}>
                        No assigned patients match this view.
                    </div>
                ) : (
                    <div className="tbl-wrap">
                        <table className="tbl">
                            <thead>
                                <tr>
                                    {['Patient', 'Age/Sex', 'Risk', 'Score', 'Trend', 'Caregiver', 'Last Test', 'Action'].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={getId(p)}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="avatar-small">{initials(p.name)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'var(--b2)', fontSize: '13px' }}>{p.name}</div>
                                                    <div style={{ fontSize: '10px', color: 'var(--b4)' }}>{p.city || 'Location pending'} - {p.tests || 0} assessments</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>{p.age}y / {p.gender || 'NA'}</td>
                                        <td><span className={`badge ${p.risk === 'High' ? 'br' : p.risk === 'Moderate' ? 'ba' : 'bg'}`}>{p.risk}</span></td>
                                        <td>
                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: getScoreColor(p.score) }}>{p.score ?? 'NA'}</div>
                                            <div className="prog-t" style={{ width: '40px' }}>
                                                <div className="prog-f" style={{ width: `${p.score || 0}%`, background: getScoreColor(p.score) }}></div>
                                            </div>
                                        </td>
                                        <td style={{ color: p.trend === 'up' || p.trend === 'stable' ? '#10B981' : '#F43F5E' }}>
                                            {p.trend || 'pending'}
                                        </td>
                                        <td style={{ fontSize: '12px', color: 'var(--b3)' }}>{p.caregiver || 'Caregiver pending'}</td>
                                        <td style={{ fontSize: '11px', color: p.flag ? '#F59E0B' : 'var(--b4)' }}>{formatDate(p.lastTest)}</td>
                                        <td>
                                            <button className="btn btn-g btn-sm" onClick={() => setSelectedPatient(p)}>Report</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedPatient && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '90%', maxWidth: '460px', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setSelectedPatient(null)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--b2)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
                        <h2>{selectedPatient.name}</h2>
                        <p style={{ color: 'var(--b3)', fontSize: '12px' }}>{selectedPatient.doctorRecommendationReason || 'Clinical report summary'}</p>
                        <hr style={{ margin: '20px 0', borderColor: 'var(--navy-3)' }} />
                        <div className="g2">
                            <div className="card kpi"><div className="kpi-label">Score</div><div className="kpi-val">{selectedPatient.score ?? 'NA'}</div></div>
                            <div className="card kpi"><div className="kpi-label">Status</div><div className="kpi-val" style={{ color: getScoreColor(selectedPatient.score) }}>{selectedPatient.risk}</div></div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                            <button className="btn btn-v" style={{ flex: 1 }} onClick={() => {
                                navigate('/doctor/reports');
                            }}>Full Report</button>
                            <button className="btn btn-g" style={{ flex: 1 }} onClick={() => {
                                navigate('/doctor/notes');
                            }}>Add Note</button>
                        </div>
                        <button className="btn btn-c" style={{ width: '100%', marginTop: '12px' }} onClick={() => setSelectedPatient(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Patients;
