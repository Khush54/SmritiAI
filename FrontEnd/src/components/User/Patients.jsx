import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css'
import { addPatient } from '../../Services/patientService'
import { getAlerts } from '../../Services/alertService'
import { AppContext } from '../../context/AppContext'
import { useContext } from 'react'

const getId = (item) => item?.id || item?._id;

function Patients({ patients = [], selectedPatient, setSelectedPatient, onAddPatient }) {
    const { setAlerts, showAlert } = useContext(AppContext);
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        relation: '',
        age: '',
        location: '',
        notes: ''
    });

    const getScoreColor = (score) => {
        if (score < 50) return "#ef4444";
        if (score < 75) return "#f59e0b";
        return "#10b981";
    };

    const getRiskColor = (risk) => {
        if (risk === 'High') return "#ef4444";
        if (risk === 'Moderate') return "#f59e0b";
        return "#10b981";
    };

    const RiskBadge = ({ risk }) => {
        const color = getRiskColor(risk);
        return (
            <span className="badge" style={{
                background: color + '22',
                color: color,
                border: `1px solid ${color}33`,
                fontSize: '11px'
            }}>
                {risk} Risk
            </span>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await addPatient(formData);
            if (res.success) {
                // Assuming the backend returns the newly created patient with an 'id' and defaults
                onAddPatient?.(res.data);
                const alertsRes = await getAlerts();
                if (alertsRes.success) setAlerts(alertsRes.data);
                setIsAdding(false);
                setFormData({ name: '', relation: '', age: '', location: '', notes: '' });
                showAlert("Profile created successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to add patient", error);
            showAlert("Failed to create profile. Please try again.", "error");
        }
    };

    const handleAction = (action, patient) => {
        if (setSelectedPatient) {
            setSelectedPatient(patient);
        }
        navigate(`/user/${action}`);
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

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>FULL NAME</label>
                                <input
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)' }}
                                    type="text" placeholder="John Doe" required value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>RELATION</label>
                                <select
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)' }}
                                    required value={formData.relation}
                                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
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

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>AGE</label>
                                <input
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)' }}
                                    type="number" placeholder="65" required value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>LOCATION</label>
                                <input
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)' }}
                                    type="text" placeholder="City" value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>


                        <div className="input-group">
                            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c4)', marginBottom: '8px', display: 'block' }}>INITIAL NOTES</label>
                            <textarea
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--c7)', background: 'var(--bg)', color: 'var(--c1)', minHeight: '80px', resize: 'none' }}
                                placeholder="Medical history or concerns..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                        <p><span>Monitoring {patients.length} family members</span></p>
                    </div>
                    <button className="btn btn-p btn-sm" onClick={() => setIsAdding(true)}>
                        + Add Patient
                    </button>
                </div>
            </div>

            {patients.length > 0 ? (
                patients.map((p) => (
                    <div
                        key={getId(p)}
                        className="card card-hover"
                        onClick={() => setSelectedPatient?.(p)}
                        style={{
                            marginBottom: '16px',
                            cursor: 'pointer',
                            position: 'relative',
                            boxShadow: getId(selectedPatient) === getId(p) ? '0 0 0 2px var(--blue), 0 4px 12px rgba(59, 130, 246, 0.2)' : 'var(--shadow)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {getId(selectedPatient) === getId(p) && (
                            <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-10px',
                                background: 'var(--blue)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                zIndex: 10
                            }}>✓</div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', flexWrap: 'wrap' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: `linear-gradient(135deg, ${getRiskColor(p.risk)}, var(--c1))`,
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
                                    Age {p.age} {p.doctor ? `· ${p.doctor}` : ''} · {p.location}
                                </div>
                            </div>

                            <RiskBadge risk={p.risk} />

                            <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', color: getScoreColor(p.score) }}>
                                {p.score === null ? (
                                    <span style={{ fontSize: '12px', color: 'var(--c4)', fontWeight: 400 }}>No test yet</span>
                                ) : (
                                    <>
                                        {p.score}<span style={{ fontSize: '14px', color: 'var(--c4)', fontWeight: 400 }}>/100</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {p.score !== null || p.mood !== null || p.sleep !== null || p.appetite !== null ? (
                            <div className="g4" style={{ gap: '12px', marginBottom: '16px' }}>
                                {[
                                    { label: 'Mood', value: p.mood },
                                    { label: 'Sleep', value: p.sleep },
                                    { label: 'Appetite', value: p.appetite },
                                    { label: 'Trend', value: p.trend }
                                ].filter(s => s.value !== null).map((stat, idx) => (
                                    <div key={idx} style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '11px', color: 'var(--c4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                                            {stat.label}
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--c1)' }}>
                                            {stat.label === 'Trend' 
                                                ? (stat.value === 'declining' ? '📉 Declining' : '📊 Stable')
                                                : stat.value
                                            }
                                        </div>
                                    </div>
                                ))}
                                {p.score !== null && (
                                    <div style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '11px', color: 'var(--c4)', marginBottom: '4px', textTransform: 'uppercase' }}>Cognitive</div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: getScoreColor(p.score) }}>{p.score}%</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ 
                                background: 'var(--c8)', 
                                borderRadius: 'var(--r10)', 
                                padding: '16px', 
                                textAlign: 'center', 
                                marginBottom: '16px',
                                border: '1px dashed var(--c7)'
                            }}>
                                <p style={{ fontSize: '13px', color: 'var(--c4)' }}>
                                    No health data logged yet. Take a test or log daily observations.
                                </p>
                            </div>
                        )}

                        <div style={{
                            background: 'var(--c8)',
                            borderRadius: 'var(--r10)',
                            padding: '13px',
                            marginBottom: '14px',
                            borderLeft: `3px solid ${getRiskColor(p.risk)}`
                        }}>
                            <p style={{ fontSize: '13px', color: 'var(--c2)', lineHeight: 1.6, fontStyle: 'italic' }}>
                                "{p.notes || 'No recent notes available.'}"
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button className="btn btn-s btn-sm" onClick={() => handleAction('reports', p)}>
                                📊 Reports
                            </button>
                            <button 
                                className="btn btn-s btn-sm" 
                                style={{ opacity: p.lastLogDate === new Date().toLocaleDateString('en-CA') ? 0.6 : 1 }}
                                disabled={p.lastLogDate === new Date().toLocaleDateString('en-CA')}
                                onClick={() => handleAction('mood', p)}
                            >
                                {p.lastLogDate === new Date().toLocaleDateString('en-CA') ? '✅ Logged' : '📝 New Log'}
                            </button>
                            <button 
                                className="btn btn-p btn-sm" 
                                style={{ opacity: p.lastTestDate === new Date().toLocaleDateString('en-CA') ? 0.6 : 1 }}
                                disabled={p.lastTestDate === new Date().toLocaleDateString('en-CA')}
                                onClick={() => handleAction('test', p)}
                            >
                                {p.lastTestDate === new Date().toLocaleDateString('en-CA') ? '✅ Tested' : '🧠 Take Test'}
                            </button>
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


