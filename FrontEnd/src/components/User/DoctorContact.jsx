import React from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css'

const DoctorContact = ({ patient }) => {
    const navigate = useNavigate();

    const getRecommendedDoctor = (p) => {
        if (!p || p.score === null) return null;
        if (p.risk === 'High' || p.score < 50) return {
            name: 'Dr. Priya Sharma',
            specialty: 'Neurologist',
            hospital: 'AIIMS Neurology Dept.',
            phone: '+91-11-2659-3308',
            email: 'neurology@aiims.edu',
            urgency: 'high',
            reason: 'cognitive score below 50 and high-risk classification'
        };
        if (p.risk === 'Moderate' || p.score < 75) return {
            name: 'Dr. Anil Kumar',
            specialty: 'General Physician',
            hospital: 'Apollo Clinics India',
            phone: '+91-44-2829-0200',
            email: 'appointments@apolloclinics.com',
            urgency: 'moderate',
            reason: 'moderate cognitive risk detected'
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
                        <div style={{ fontSize: '13px', color: 'var(--c3)' }}>{doctor.specialty} · {doctor.hospital}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--c4)', marginBottom: '4px', textTransform: 'uppercase' }}>Specialty</div>
                        <div style={{ fontWeight: '600', color: 'var(--c1)' }}>{doctor.specialty}</div>
                    </div>
                    <div style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--c4)', marginBottom: '4px', textTransform: 'uppercase' }}>Hospital</div>
                        <div style={{ fontWeight: '600', color: 'var(--c1)' }}>{doctor.hospital}</div>
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
        </div>
    );
};

export default DoctorContact;