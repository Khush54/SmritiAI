import React, { useState } from 'react';

function Patients({ patients = [], setPage, setSelectedPatient, onAddPatient }) {
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        relation: '',
        age: '',
        location: '',
        doctor: '',
        notes: ''
    });

    const getScoreColor = (score) => {
        if (score < 50) return "var(--rose)";
        if (score < 75) return "var(--warm)";
        return "var(--sage)";
    };

    const RiskBadge = ({ risk }) => {
        const className = risk === 'High' ? 'badge br' : 'badge bg';
        return <span className={className}>{risk} Risk</span>;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddPatient?.({
            ...formData,
         id: crypto.randomUUID(), 
            score: 100, 
            risk: 'Low',
            trend: 'stable',
            mood: 'Neutral',
            sleep: 'Normal',
            appetite: 'Normal'
        });
        setIsAdding(false);
        setFormData({ name: '', relation: '', age: '', location: '', doctor: '', notes: '' });
    };

    const handleAction = (targetPage, patient) => {
        setSelectedPatient?.(patient);
        setPage(targetPage);           
    };

    if (isAdding) {
        return (
            <div className="page" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="ph">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1>New Profile 👤</h1>
                            <p>Add a family member to monitor</p>
                        </div>
                        <button className="btn btn-s" onClick={() => setIsAdding(false)}>✕</button>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px', border: '1px solid var(--c8)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>FULL NAME</label>
                                <input 
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)' }}
                                    type="text" placeholder="John Doe" required value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>RELATION</label>
                                <select 
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)' }}
                                    required value={formData.relation}
                                    onChange={(e) => setFormData({...formData, relation: e.target.value})}
                                >
                                    <option value="">Select...</option>
                                    <option value="Self">Self</option>
                                    <option value="Father">Father</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Grandfather">Grandfather</option>
                                    <option value="Grandmother">Grandmother</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>AGE</label>
                                <input 
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)' }}
                                    type="number" placeholder="65" required value={formData.age}
                                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>LOCATION</label>
                                <input 
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)' }}
                                    type="text" placeholder="City" value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>PRIMARY DOCTOR</label>
                            <input 
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)' }}
                                type="text" placeholder="Dr. Name" value={formData.doctor}
                                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                            />
                        </div>

                        <div className="input-group">
                            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>INITIAL NOTES</label>
                            <textarea 
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)', minHeight: '80px', resize: 'none' }}
                                placeholder="Medical history or concerns..."
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
                            <button type="button" className="btn btn-s" style={{ flex: 1 }} onClick={() => setIsAdding(false)}>Cancel</button>
                            <button type="submit" className="btn btn-p" style={{ flex: 2 }}>Create Profile</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>My Patients</h1>
                        <p>Monitoring {patients.length} family members</p>
                    </div>
                    <button className="btn btn-p btn-sm" onClick={() => setIsAdding(true)}>
                        + Add Patient
                    </button>
                </div>
            </div>

            {patients.length > 0 ? (
                patients.map((p) => (
                    <div key={p.id} className="card" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', flexWrap: 'wrap' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: `linear-gradient(135deg, ${p.risk === 'High' ? '#F43F5E, #EF4444' : '#10B981, #0EA5E9'})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '22px', fontWeight: 700, flexShrink: 0
                            }}>
                                {p.name ? p.name[0] : '?'}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '17px', fontWeight: 700 }}>
                                    {p.name} <span style={{ fontSize: '12px', color: 'var(--c4)', fontWeight: 400 }}>({p.relation})</span>
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--c4)' }}>
                                    Age {p.age} · {p.doctor} · {p.location}
                                </div>
                            </div>

                            <RiskBadge risk={p.risk} />

                            <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', color: getScoreColor(p.score) }}>
                                {p.score}<span style={{ fontSize: '14px', color: 'var(--c4)', fontWeight: 400 }}>/100</span>
                            </div>
                        </div>

                        <div className="g4" style={{ gap: '12px', marginBottom: '16px' }}>
                            {[
                                { label: 'Mood', value: p.mood },
                                { label: 'Sleep', value: p.sleep },
                                { label: 'Appetite', value: p.appetite },
                                { label: 'Trend', value: p.trend === 'declining' ? '📉 Declining' : '📊 Stable' }
                            ].map((stat, idx) => (
                                <div key={idx} style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '12px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--c4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                                        {stat.label}
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--c1)' }}>
                                        {stat.value || '--'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            background: 'var(--c8)',
                            borderRadius: 'var(--r10)',
                            padding: '13px',
                            marginBottom: '14px',
                            borderLeft: `3px solid ${p.risk === 'High' ? '#F43F5E' : '#10B981'}`
                        }}>
                            <p style={{ fontSize: '13px', color: 'var(--c2)', lineHeight: 1.6, fontStyle: 'italic' }}>
                                "{p.notes || 'No recent notes available.'}"
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                             <button className="btn btn-s btn-sm" onClick={() => handleAction('reports', p)}>
                                    📊 Reports
                                </button>
                                <button className="btn btn-s btn-sm" onClick={() => handleAction('mood', p)}>
                                    📝 New Log
                                </button>
                            {p.risk === 'High' && (
                                <button className="btn btn-r btn-sm">📞 Call Doctor</button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏘️</div>
                    <h3>No Patients Added</h3>
                    <p style={{ color: 'var(--c4)', fontSize: '14px' }}>Click the button above to add a family member.</p>
                </div>
            )}
        </div>
    );
}

export default Patients;


