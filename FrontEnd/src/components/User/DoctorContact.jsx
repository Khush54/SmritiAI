import React from 'react';
import './User.css'

const DoctorContact = ({ patient, setPage }) => {
    
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
                
                <p style={{ color: 'var(--c3)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                    {doctorInfo 
                        ? `You can now share reports or schedule a consultation with ${patient.name}'s assigned specialist.` 
                        : sub
                    }
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {doctorInfo && (
                        <button className="btn btn-p" onClick={() => window.open(`tel:${patient.phone || ''}`)}>
                            📞 Call Doctor
                        </button>
                    )}
                    <button className="btn btn-s" onClick={() => setPage('home')}>
                        ← Back to Overview
                    </button>
                </div>
            </div>
        </div>
    );

    if (!patient) {
        return renderContent('Doctor Contact', 'Please select a patient to view care team details.', '👩‍⚕️');
    }

    if (!patient.doctor) {
        return renderContent(
            'No Doctor Assigned', 
            `No specialist has been linked to ${patient.name}'s profile yet. You can add doctor details in Settings.`, 
            '🏥'
        );
    }

    return renderContent(
        'Doctor Contact', 
        'Communicate with the care team', 
        '👩‍⚕️', 
        patient.doctor
    );
};

export default DoctorContact;