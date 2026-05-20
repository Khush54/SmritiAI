import React from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css'

const DoctorContact = ({ patient }) => {
    const navigate = useNavigate();

    const getRecommendedDoctor = (p) => {
        if (!p || p.score === null) return null;
        if (p.assignedDoctorId || p.assignedDoctorName || p.doctor) return {
            name: p.assignedDoctorName || p.doctor,
            specialty: p.assignedDoctorSpecialty || 'Cognitive Care Specialist',
            hospital: p.assignedDoctorClinic || 'Smriti AI clinical network',
            location: p.assignedDoctorLocation || p.assignedDoctorCity || '',
            phone: p.assignedDoctorPhone || 'Shared after booking',
            email: p.assignedDoctorEmail || 'Shared after booking',
            urgency: p.risk === 'High' ? 'high' : 'moderate',
            reason: p.doctorRecommendationReason || `${p.risk.toLowerCase()} cognitive risk detected`,
            isNearby: !p.doctorRecommendationReason?.toLowerCase().includes('no nearby doctor')
        };
        if (p.risk === 'High' || p.score < 50 || p.risk === 'Moderate' || p.score < 75) return {
            name: 'Doctor assignment pending',
            specialty: p.risk === 'High' ? 'Neurologist' : 'Clinical Review',
            hospital: 'Smriti AI clinical network',
            phone: 'Pending',
            email: 'Pending',
            urgency: p.risk === 'High' || p.score < 50 ? 'high' : 'moderate',
            reason: 'AI recommended a consultation and is waiting for an available doctor account',
            isNearby: false
        };
        return null;
    };

    if (!patient) {
        return (
            <div className="page">
                <div className="ph"><div className="ph-row"><div><h1>Doctor Contact 👩‍⚕️</h1><p>Select a patient to view recommendations</p></div></div></div>
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '60px', marginBottom: '16px' }}>👥</div>
                    <h3 style={{ color: 'var(--c1)' }}>No Patient Selected</h3>
                    <p style={{ color: 'var(--c4)', marginBottom: '20px' }}>Please select a family member from the dashboard to view care team recommendations.</p>
                    <button className="btn btn-p btn-sm" onClick={() => navigate('/user/home')}>← Back to Overview</button>
                </div>
            </div>
        );
    }

    if (patient.score === null) {
        return (
            <div className="page">
                <div className="ph"><div className="ph-row"><div><h1>Doctor Contact 👩‍⚕️</h1><p>Care team for <strong>{patient.name}</strong></p></div></div></div>
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '60px', marginBottom: '16px' }}>📝</div>
                    <h3 style={{ color: 'var(--c1)', marginBottom: '8px' }}>Assessment Required First</h3>
                    <p style={{ color: 'var(--c4)', maxWidth: '400px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                        We need cognitive data from at least one assessment before we can make a specialist recommendation for <strong>{patient.name}</strong>.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button className="btn btn-p btn-sm" onClick={() => navigate('/user/test')}>🧠 Start Assessment</button>
                        <button className="btn btn-s btn-sm" onClick={() => navigate('/user/home')}>← Back</button>
                    </div>
                </div>
            </div>
        );
    }

    const doctor = getRecommendedDoctor(patient);
    const sharedNotes = patient.sharedClinicalNotes || (patient.clinicalNotes || []).filter(note => note.sharedWithCaregiver);
    const latestSharedNote = patient.latestSharedClinicalNote || sharedNotes?.[0] || null;
    const visitText = `${latestSharedNote?.noteType || ''} ${latestSharedNote?.recommendations || ''} ${latestSharedNote?.observation || ''}`.toLowerCase();
    const doctorRequestedVisit = Boolean(latestSharedNote) && (
        latestSharedNote.noteType === 'Referral' ||
        visitText.includes('visit') ||
        visitText.includes('appointment') ||
        visitText.includes('consult')
    );

    if (!doctor) {
        return (
            <div className="page">
                <div className="ph"><div className="ph-row"><div><h1>Doctor Contact 👩‍⚕️</h1><p>Care status for <strong>{patient.name}</strong></p></div></div></div>
                <div className="card" style={{ textAlign: 'center', padding: '60px', borderLeft: '4px solid var(--sage)' }}>
                    <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏥</div>
                    <h3 style={{ color: 'var(--c1)', marginBottom: '8px' }}>Health Status: Stable ✅</h3>
                    <p style={{ color: 'var(--c4)', maxWidth: '420px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                        Based on the latest assessments, <strong>{patient.name}</strong>'s cognitive metrics are within healthy ranges. No specialist intervention is recommended at this time. Keep up the daily monitoring!
                    </p>
                    <button className="btn btn-s btn-sm" onClick={() => navigate('/user/home')}>← Back to Overview</button>
                </div>
            </div>
        );
    }

    const urgencyColor = doctor.urgency === 'high' ? 'var(--rose)' : 'var(--warm)';
    const urgencyBg = doctor.urgency === 'high' ? '#fee2e2' : '#fef3c7';
    const urgencyLabel = doctor.urgency === 'high' ? '🚨 Urgent Referral' : '⚠️ Recommended Consultation';

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>Recommended Specialist 👩‍⚕️</h1>
                        <p>Based on <strong>{patient.name}</strong>'s current cognitive risk profile</p>
                    </div>
                </div>
            </div>

            <div style={{
                background: urgencyBg,
                border: `1px solid ${urgencyColor}44`,
                borderRadius: 'var(--r10)',
                padding: '12px 18px',
                marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13.5px', fontWeight: '600', color: urgencyColor
            }}>
                {urgencyLabel} — due to {doctor.reason}.
            </div>

            {!doctor.isNearby && (
                <div style={{
                    background: '#fff7ed',
                    border: '1px solid #fb923c55',
                    borderRadius: 'var(--r10)',
                    padding: '12px 18px',
                    marginBottom: '20px',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    color: '#c2410c'
                }}>
                    No nearby doctor was found for {patient.location || 'this location'}. You can still visit the suggested available specialist.
                </div>
            )}

            {doctorRequestedVisit && (
                <div style={{
                    background: '#fee2e2',
                    border: '1px solid #ef444455',
                    borderRadius: 'var(--r10)',
                    padding: '12px 18px',
                    marginBottom: '20px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    color: '#b91c1c'
                }}>
                    Doctor has recommended a visit for {patient.name}. Please review the latest clinical note below before booking or travelling.
                </div>
            )}

            <div className="card" style={{ borderLeft: `4px solid ${urgencyColor}`, marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg, ${urgencyColor}, var(--blue))`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '28px'
                    }}>👩‍⚕️</div>
                    <div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--c1)' }}>{doctor.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--c3)' }}>{doctor.specialty} · {doctor.hospital}{doctor.location ? ` · ${doctor.location}` : ''}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--c4)', marginBottom: '4px', textTransform: 'uppercase' }}>Specialty</div>
                        <div style={{ fontWeight: '600', color: 'var(--c1)' }}>{doctor.specialty}</div>
                    </div>
                    <div style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--c4)', marginBottom: '4px', textTransform: 'uppercase' }}>Hospital / City</div>
                        <div style={{ fontWeight: '600', color: 'var(--c1)' }}>{doctor.hospital}</div>
                        {doctor.location && <div style={{ fontSize: '12px', color: 'var(--c4)', marginTop: '2px' }}>{doctor.location}</div>}
                    </div>
                    <div style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--c4)', marginBottom: '4px', textTransform: 'uppercase' }}>Phone</div>
                        <div style={{ fontWeight: '600', color: 'var(--c1)' }}>{doctor.phone}</div>
                    </div>
                    <div style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--c4)', marginBottom: '4px', textTransform: 'uppercase' }}>Email</div>
                        <div style={{ fontWeight: '600', color: 'var(--c1)', fontSize: '12px' }}>{doctor.email}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button className="btn btn-p" onClick={() => window.open(`tel:${doctor.phone}`)}>
                        📞 Call Now
                    </button>
                    <button className="btn btn-s" onClick={() => window.open(`mailto:${doctor.email}`)}>
                        ✉️ Send Email
                    </button>
                    <button className="btn btn-s" onClick={() => navigate('/user/reports')}>
                        📄 Share Report
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/user/home')}>
                        ← Back
                    </button>
                </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--c4)', padding: '12px', background: 'var(--c8)', borderRadius: 'var(--r10)' }}>
                ⚠️ <strong>Disclaimer:</strong> Smriti AI does not provide medical treatment or definitive diagnosis. This is a screening tool. Always consult a licensed medical professional.
            </div>

            {latestSharedNote && (
                <div className="card" style={{ marginTop: '20px', borderLeft: '4px solid var(--blue)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--c4)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>
                        Latest Doctor Note
                    </div>
                    <h3 style={{ color: 'var(--c1)', marginBottom: '8px' }}>{latestSharedNote.noteType || 'Clinical Note'}</h3>
                    <p style={{ color: 'var(--c3)', lineHeight: 1.6, marginBottom: '12px' }}>
                        {latestSharedNote.observation}
                    </p>
                    {latestSharedNote.recommendations && (
                        <div style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '12px', color: 'var(--c2)', lineHeight: 1.5 }}>
                            <strong>Doctor recommendation:</strong> {latestSharedNote.recommendations}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorContact;
