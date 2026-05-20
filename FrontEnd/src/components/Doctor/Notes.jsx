import React, { useEffect, useState, useContext } from 'react';
import { saveClinicalNote } from '../../Services/doctorService';
import { AppContext } from '../../context/AppContext';

const EMPTY_PATIENTS = [];
const EMPTY_NOTES = [];
const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No note yet';
const scoreColor = (score = 0) => score < 50 ? 'var(--rose)' : score < 75 ? 'var(--amber)' : 'var(--emerald)';

function Notes({ dashboard, loading, error, refreshDashboard }) {
    const { showAlert } = useContext(AppContext);
    const patients = dashboard?.patients || EMPTY_PATIENTS;
    const noteHistory = dashboard?.noteHistory || EMPTY_NOTES;
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        noteType: 'Progress Note',
        observation: '',
        recommendations: ''
    });

    useEffect(() => {
        if (!formData.patientId && patients.length > 0) {
            setFormData(prev => ({ ...prev, patientId: patients[0].id }));
        }
    }, [patients, formData.patientId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (isSharing) => {
        if (!formData.patientId || !formData.observation.trim()) {
            showAlert("Please select a patient and enter clinical observations.", "error");
            return;
        }

        try {
            setSaving(true);
            await saveClinicalNote(formData.patientId, {
                noteType: formData.noteType,
                observation: formData.observation,
                recommendations: formData.recommendations,
                sharedWithCaregiver: isSharing
            });
            await refreshDashboard?.();
            setFormData(prev => ({ ...prev, observation: '', recommendations: '' }));
            showAlert(isSharing ? "Note saved and shared with caregiver." : "Clinical note saved.", "success");
        } catch (err) {
            console.error("Error saving note", err);
            showAlert("Error saving note.", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="page">Loading clinical records...</div>;
    if (error) return <div className="page"><div className="card">{error}</div></div>;

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>Clinical Notes</h1>
                        <p>DOCUMENTATION FOR ASSIGNED PATIENTS</p>
                    </div>
                </div>
            </div>

            <div className="g2" style={{ gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
                <div>
                    <h3 style={{ fontSize: '12px', color: 'var(--b4)', marginBottom: '12px', textTransform: 'uppercase' }}>Recent History</h3>
                    {(noteHistory.length ? noteHistory : patients).map(p => (
                        <div key={`${p.patientId || p.id}-${p.id || p.updatedAt}`} className="card" style={{
                            marginBottom: '12px',
                            cursor: 'pointer',
                            borderLeft: `2px solid ${scoreColor(p.score)}`,
                            transition: 'transform 0.2s'
                        }} onClick={() => setFormData(prev => ({ ...prev, patientId: p.patientId || p.id }))}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div className="nav-avi" style={{ width: '30px', height: '30px', fontSize: '11px' }}>{p.name?.[0]}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--b2)' }}>{p.name}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--b4)', fontFamily: 'var(--mono)' }}>Last note: {formatDate(p.lastTest)}</div>
                                </div>
                                <span className={`badge ${p.risk === 'High' ? 'br' : p.risk === 'Moderate' ? 'ba' : 'bg'}`} style={{ fontSize: '9px' }}>{p.risk}</span>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--b2)', lineHeight: '1.6', fontStyle: 'italic' }}>
                                "{p.notes || 'No clinical note recorded yet.'}"
                            </p>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ height: 'fit-content' }}>
                    <div className="sh-title" style={{ marginBottom: '16px', fontSize: '16px' }}>Add Clinical Note</div>
                    {patients.length === 0 ? (
                        <p style={{ color: 'var(--b3)' }}>No assigned patients are available for notes.</p>
                    ) : (
                        <>
                            <div className="field">
                                <label className="flabel">Patient</label>
                                <select className="finput" name="patientId" value={formData.patientId} onChange={handleInputChange}>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>

                            <div className="field">
                                <label className="flabel">Note Type</label>
                                <select className="finput" name="noteType" value={formData.noteType} onChange={handleInputChange}>
                                    <option>Progress Note</option>
                                    <option>Prescription Change</option>
                                    <option>Referral</option>
                                    <option>Test Review</option>
                                </select>
                            </div>

                            <div className="field">
                                <label className="flabel">Clinical Observation</label>
                                <textarea className="finput" name="observation" rows="5" placeholder="Document clinical findings, assessment, and plan..." style={{ resize: 'none' }} value={formData.observation} onChange={handleInputChange}></textarea>
                            </div>

                            <div className="field">
                                <label className="flabel">Recommendations</label>
                                <textarea className="finput" name="recommendations" rows="3" placeholder="Prescriptions, referrals, lifestyle changes..." style={{ resize: 'none' }} value={formData.recommendations} onChange={handleInputChange}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <button className="btn btn-c" style={{ flex: 1 }} disabled={saving} onClick={() => handleSubmit(false)}>Save Note</button>
                                <button className="btn btn-v" style={{ flex: 1.5 }} disabled={saving} onClick={() => handleSubmit(true)}>Save & Share</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notes;
