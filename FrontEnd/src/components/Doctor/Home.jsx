import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [patients] = useState([
        { id: 1, name: "Anita Rao", age: 62, gender: "F", risk: "High", score: 42, city: "Delhi", lastTest: "12 Dec", followUp: "28 Dec", flag: true, trend: 'down' },
        { id: 2, name: "Suresh Gupta", age: 71, gender: "M", risk: "High", score: 38, city: "Mumbai", lastTest: "15 Dec", followUp: "30 Dec", flag: false, trend: 'down' },
        { id: 3, name: "Meera Singh", age: 55, gender: "F", risk: "Medium", score: 65, city: "Noida", lastTest: "20 Dec", followUp: "05 Jan", flag: true, trend: 'up' }
    ]);

    const [selectedId, setSelectedId] = useState(null);

    const highPts = patients.filter(p => p.risk === 'High');
    const scoreColor = (s) => s < 50 ? 'var(--rose)' : 'var(--emerald)';
    
    const stats = [
        { label: 'Total Patients', val: patients.length, color: 'var(--cyan)', icon: '📊', target: 'patients' },
        { label: 'High Risk', val: highPts.length, color: 'var(--rose)', icon: '🚨', target: 'alerts' },
        { label: 'Scheduled', val: '12', color: 'var(--amber)', icon: '📅', target: 'home' },
        { label: 'Reports', val: '5', color: 'var(--violet)', icon: '📋', target: 'home' }
    ];

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--b1)' }}>Command Centre ⚡</h1>
                        <p style={{ color: 'var(--b3)', fontSize: '12px', marginTop: '4px', letterSpacing: '0.5px' }}>
                            DR. PRIYA SHARMA · NEUROLOGIST · {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                        </p>
                    </div>
                    <div className="ph-act" style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-g btn-sm" onClick={() => navigate('/doctor/alerts')}>
                            <span>🔔</span> {highPts.length} Alerts
                        </button>
                        <button className="btn btn-c" onClick={() => navigate('/doctor/patients')}>
                            View Patient
                        </button>
                    </div>
                </div>
            </div>

            <div className="g4" style={{ marginBottom: '24px' }}>
                {stats.map((s, i) => (
                    <div 
                        key={i} 
                        className="card kpi" 
                        onClick={() => navigate(`/doctor/${s.target}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="kpi-accent" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                        <div className="kpi-val" style={{ color: s.color }}>{s.val}</div>
                        <div className="kpi-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="g2" style={{ gridTemplateColumns: selectedId ? '1.5fr 1fr' : '1fr', transition: 'all 0.3s ease' }}>
                
                <div className="card">
                    <div className="sh" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="sh-title" style={{ fontSize: '16px', fontWeight: '600' }}>Patient Surveillance</div>
                            <div className="sh-sub" style={{ fontSize: '11px', color: 'var(--b4)' }}>RECENT ACTIVITY</div>
                        </div>
                        <button className="btn btn-g btn-sm" onClick={() => navigate('/doctor/patients')}>View Full Directory</button>
                    </div>

                    <div className="tbl-wrap" style={{ overflowX: 'auto' }}>
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Risk Level</th>
                                    <th>Cog. Score</th>
                                    <th>Next Visit</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(p => (
                                    <tr key={p.id} style={{ background: selectedId === p.id ? 'var(--navy-2)' : 'transparent' }}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="nav-avi" style={{ width: '32px', height: '32px', fontSize: '12px' }}>{p.name.split(' ').map(n => n[0]).join('')}</div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'var(--b1)' }}>{p.name}</div>
                                                    <div style={{ fontSize: '10px', color: 'var(--b4)' }}>{p.city} · {p.age}y</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${p.risk === 'High' ? 'br' : 'ba'}`}>
                                                {p.risk}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: '600', color: scoreColor(p.score), fontFamily: 'var(--mono)' }}>
                                                {p.score}
                                                <span style={{ fontSize: '10px', marginLeft: '4px' }}>{p.trend === 'up' ? '▲' : '▼'}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '12px', color: 'var(--b2)' }}>{p.followUp}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button 
                                                className="btn btn-g btn-sm" 
                                                onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
                                            >
                                                {selectedId === p.id ? 'Close' : 'Quick View'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedId && (
                    <div className="card page" style={{ borderLeft: `4px solid ${scoreColor(patients.find(p => p.id === selectedId).score)}` }}>
                        {patients.filter(p => p.id === selectedId).map(p => (
                            <div key={p.id}>
                                <div className="sh">
                                    <div className="sh-title">Quick Analysis</div>
                                    <button onClick={() => setSelectedId(null)} style={{ color: 'var(--b4)', fontSize: '18px' }}>&times;</button>
                                </div>
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <div className="nav-avi" style={{ width: '64px', height: '64px', fontSize: '24px', margin: '0 auto 12px' }}>{p.name[0]}</div>
                                    <h2 style={{ color: 'var(--b1)' }}>{p.name}</h2>
                                    <p style={{ color: 'var(--b3)' }}>Patient ID: #00{p.id}42</p>
                                </div>
                                <div className="g2" style={{ gap: '10px' }}>
                                    <div className="card kpi" style={{ padding: '12px' }}>
                                        <div className="kpi-label" style={{ fontSize: '10px' }}>Last Test</div>
                                        <div style={{ fontWeight: '600' }}>{p.lastTest}</div>
                                    </div>
                                    <div className="card kpi" style={{ padding: '12px' }}>
                                        <div className="kpi-label" style={{ fontSize: '10px' }}>Status</div>
                                        <div style={{ fontWeight: '600', color: p.flag ? 'var(--rose)' : 'var(--emerald)' }}>
                                            {p.flag ? 'Urgent' : 'Stable'}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="btn btn-c" 
                                    style={{ width: '100%', marginTop: '20px' }}
                                    onClick={() => console.log("Navigating to full profile for", p.id)}
                                >
                                    Full Clinical Record
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;