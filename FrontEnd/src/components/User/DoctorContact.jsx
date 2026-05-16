import React from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css'

const DoctorContact = ({ patient }) => {
    const navigate = useNavigate();
    
    const renderContent = (title, sub, emoji, doctorInfo = null) => (
        <div className="page">
            {/* Page Header */}
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>{title}</h1>
                        <p>{sub}</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>{emoji}</div>
                <h3 style={{ fontFamily: "'Lora', serif", fontSize: '22px', marginBottom: '8px' }}>
                    {doctorInfo ? `Dr. ${doctorInfo}` : title}
                </h3>
                
                <p style={{ color: 'var(--c3)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px', lineHeight: '1.5' }}>
                    {doctorInfo 
                        ? sub
                        : sub
                    }
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {doctorInfo && (
                        <button className="btn btn-p" onClick={() => window.open(`tel:${patient.phone || ''}`)}>
                            📞 Call Doctor
                        </button>
                    )}
                    <button className="btn btn-s" onClick={() => navigate('/user/home')}>
                        ← Back to Overview
                    </button>
                </div>
            </div>
        </div>
    );

    const getRecommendedDoctor = (p) => {
        if (p.risk === 'High' || p.score < 50) return "Dr. Priya Sharma (Neurologist)";
        if (p.risk === 'Medium' || p.score < 75) return "Dr. Anil Kumar (General Physician)";
        return null;
    };

    if (!patient) {
        return renderContent('Care Team', 'Please select a patient to view recommendations.', '👩‍⚕️');
    }

    const recommendedDoctor = getRecommendedDoctor(patient);

    if (!recommendedDoctor) {
        return renderContent(
            'Health Status: Stable', 
            `Based on the latest assessments, ${patient.name}'s cognitive metrics are healthy. No specialist intervention is recommended at this time.`, 
            '🏥'
        );
    }

    return renderContent(
        'Recommended Specialist', 
        `Based on ${patient.name}'s current risk level and cognitive scores, we highly recommend consulting with this specialist.`, 
        '👩‍⚕️', 
        recommendedDoctor
    );
};

export default DoctorContact;