import React, { useState, useEffect } from 'react';

function Notes(){
    // --- State Management ---
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        patientId: '',
        noteType: 'Progress Note',
        observation: '',
        recommendations: ''
    });

    // --- Data Fetching ---
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/patients');
                const data = await response.json();
                setPatients(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, patientId: data[0].id }));
                }
            } catch (err) {
                console.error("Fetch error:", err);
                // Fallback dummy data for local testing
                const dummy = [
                    { id: 1, name: "Anita Rao", risk: "High", score: 42, lastTest: "12 Dec", notes: "Showing signs of increased confusion in evening hours." },
                    { id: 2, name: "Suresh Gupta", risk: "High", score: 38, lastTest: "15 Dec", notes: "Motor skills declining; recommended physical therapy." },
                    { id: 3, name: "Meera Singh", risk: "Medium", score: 65, lastTest: "20 Dec", notes: "Stable. Responding well to current medication." }
                ];
                setPatients(dummy);
                setFormData(prev => ({ ...prev, patientId: dummy[0].id }));
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // --- Event Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (isSharing) => {
        if (!formData.observation) {
            alert("Please enter clinical observations.");
            return;
        }

        const payload = {
            ...formData,
            timestamp: new Date().toISOString(),
            sharedWithCaregiver: isSharing
        };

        try {
            console.log("Saving to Database:", payload);
            // Example API call:
            // await fetch('/api/notes', { method: 'POST', body: JSON.stringify(payload) });
            
            alert(isSharing ? "Note saved and shared with caregiver!" : "Clinical note saved successfully.");
            
            // Reset form (except patient selection)
            setFormData(prev => ({ ...prev, observation: '', recommendations: '' }));
        } catch (err) {
            alert("Error saving note.");
        }
    };

    const scoreColor = (s) => s < 50 ? 'var(--rose)' : 'var(--emerald)';

    if (loading) return <div className="page">Loading Clinical Records...</div>;

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Clinical Notes</h1>
                        <p style={{ color: 'var(--b3)', fontSize: '11px' }}>DOCUMENTATION · DR. PRIYA SHARMA</p>
                    </div>
                </div>
            </div>

            <div className="g2" style={{ gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
                {/* Left: Recent Notes List */}
                <div>
                    <h3 style={{ fontSize: '12px', color: 'var(--b4)', marginBottom: '12px', textTransform: 'uppercase' }}>Recent History</h3>
                    {patients.map(p => (
                        <div 
                            key={p.id} 
                            className="card" 
                            style={{ 
                                marginBottom: '12px', 
                                cursor: 'pointer', 
                                borderLeft: `2px solid ${scoreColor(p.score)}`,
                                transition: 'transform 0.2s'
                            }}
                            onClick={() => setFormData(prev => ({ ...prev, patientId: p.id }))}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div className="nav-avi" style={{ width: '30px', height: '30px', fontSize: '11px' }}>
                                    {p.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--b2)' }}>{p.name}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--b4)', fontFamily: 'var(--mono)' }}>Last note: {p.lastTest}</div>
                                </div>
                                <span className={`badge ${p.risk === 'High' ? 'br' : 'ba'}`} style={{ fontSize: '9px' }}>{p.risk}</span>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--b2)', lineHeight: '1.6', fontStyle: 'italic' }}>
                                "{p.notes}"
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right: Entry Form */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <div className="sh-title" style={{ marginBottom: '16px', fontSize: '16px' }}>Add Clinical Note</div>
                    
                    <div className="field">
                        <label className="flabel">Patient</label>
                        <select 
                            className="finput" 
                            name="patientId" 
                            value={formData.patientId} 
                            onChange={handleInputChange}
                        >
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="flabel">Note Type</label>
                        <select 
                            className="finput" 
                            name="noteType" 
                            value={formData.noteType} 
                            onChange={handleInputChange}
                        >
                            <option>Progress Note</option>
                            <option>Prescription Change</option>
                            <option>Referral</option>
                            <option>Test Review</option>
                        </select>
                    </div>

                    <div className="field">
                        <label className="flabel">Clinical Observation</label>
                        <textarea 
                            className="finput" 
                            name="observation"
                            rows="5" 
                            placeholder="Document clinical findings, assessment, and plan…" 
                            style={{ resize: 'none' }}
                            value={formData.observation}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <div className="field">
                        <label className="flabel">Recommendations</label>
                        <textarea 
                            className="finput" 
                            name="recommendations"
                            rows="3" 
                            placeholder="Prescriptions, referrals, lifestyle changes…" 
                            style={{ resize: 'none' }}
                            value={formData.recommendations}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button className="btn btn-c" style={{ flex: 1 }} onClick={() => handleSubmit(false)}>
                            Save Note
                        </button>
                        <button className="btn btn-v" style={{ flex: 1.5 }} onClick={() => handleSubmit(true)}>
                            Save & Share with Caregiver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notes;