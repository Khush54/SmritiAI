import React, { useState, useEffect } from 'react';
import './User.css'

function Settings({ patient, onUpdatePatient }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [selectedLang, setSelectedLang] = useState('en');
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (patient) {
            setFormData({
                firstName: patient.name?.split(' ')[0] || '',
                lastName: patient.name?.split(' ')[1] || '',
                age: patient.age || '',
                gender: patient.gender || 'Male',
                phone: patient.phone || '',
                city: patient.city || '',
                doctor: patient.doctor || ''
            });
            setSelectedLang(patient.language || 'en');
        }
    }, [patient]);

    if (!patient) {
        return (
            <div className="page" style={{ textAlign: 'center', padding: '100px' }}>
                <h2 style={{ color: 'var(--c1)' }}>No Patient Selected</h2>
                <p style={{ color: 'var(--c4)' }}>Please select a family member from the dashboard to edit settings.</p>
            </div>
        );
    }

    const languages = [
        { name: 'English', code: 'en' },
        { name: 'Hindi (हिंदी)', code: 'hi' },
        { name: 'Punjabi (ਪੰਜਾਬੀ)', code: 'pa' },
        { name: 'Bengali (বাংলা)', code: 'bn' },
        { name: 'Tamil (தமிழ்)', code: 'ta' },
        { name: 'Telugu (తెలుగు)', code: 'te' },
        { name: 'Marathi (मराठी)', code: 'mr' },
        { name: 'Gujarati (ગુજરાતી)', code: 'gu' },
        { name: 'Kannada (ಕನ್ನಡ)', code: 'kn' },
        { name: 'Malayalam (മലയാളം)', code: 'ml' }
    ];

    const handleLanguageChange = (langCode) => {
        setSelectedLang(langCode);
        const googleSelect = document.querySelector('.goog-te-combo');
        if (googleSelect) {
            googleSelect.value = langCode;
            googleSelect.dispatchEvent(new Event('change'));

            setTimeout(() => {
                document.body.style.top = "0px";
                const frame = document.querySelector('.goog-te-banner-frame');
                if (frame) frame.style.display = 'none';
            }, 10);
        }
    };

    const handleSave = () => {
        const updatedPatient = {
            ...patient,
            name: `${formData.firstName} ${formData.lastName}`,
            age: formData.age,
            gender: formData.gender,
            phone: formData.phone,
            city: formData.city,
            doctor: formData.doctor,
            language: selectedLang
        };
        onUpdatePatient(updatedPatient);
        alert(`Settings updated for ${updatedPatient.name}`);
    };

    const renderSettingsContent = () => {
        if (activeTab === 'profile') return (
            <div className="settings-section">
                <div className="settings-section-title" style={{ marginBottom: '20px', fontWeight: '700' }}>Personal Information</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px', fontWeight: '600' }}>
                        {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                    </div>
                    <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{formData.firstName} {formData.lastName}</div>
                        <button className="btn btn-secondary btn-sm">Change Photo</button>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group"><label className="form-label">First Name</label>
                        <input type="text" className="form-input" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div className="form-group"><label className="form-label">Last Name</label>
                        <input type="text" className="form-input" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                    <div className="form-group"><label className="form-label">Age</label>
                        <input type="number" className="form-input" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                    </div>
                    <div className="form-group"><label className="form-label">Gender</label>
                        <select className="form-input form-select" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                            <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                    </div>
                    <div className="form-group"><label className="form-label">Phone</label>
                        <input type="text" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="form-group"><label className="form-label">City</label>
                        <input type="text" className="form-input" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                    </div>
                </div>
                <div className="form-group"><label className="form-label">Doctor / Neurologist</label>
                    <input type="text" className="form-input" value={formData.doctor} onChange={(e) => setFormData({...formData, doctor: e.target.value})} />
                </div>
                <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            </div>
        );

        if (activeTab === 'language') return (
            <div className="settings-section">
                <div className="settings-section-title" style={{ fontWeight: '700', marginBottom: '10px' }}>Preferred Test Language</div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                    Choose the language <strong>{patient.name}</strong> is most comfortable with.
                </p>
                <div className="lang-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                    {languages.map(l => (
                        <div
                            key={l.code}
                            className={`lang-pill notranslate ${selectedLang === l.code ? 'sel' : ''}`}
                            onClick={() => handleLanguageChange(l.code)}
                            style={{
                                padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px',
                                background: selectedLang === l.code ? 'var(--blue)' : 'var(--gray-100)',
                                color: selectedLang === l.code ? '#fff' : 'var(--text-secondary)',
                                border: '1px solid var(--border)',
                                transition: '0.2s'
                            }}
                        >
                            {l.name}
                        </div>
                    ))}
                </div>
                <div style={{ background: 'var(--blue-light)', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: '13px', color: 'var(--blue)' }}>
                    ✅ Selected: <strong className="notranslate">{languages.find(l => l.code === selectedLang)?.name}</strong>
                </div>
            </div>
        );

        if (activeTab === 'privacy') return (
            <div className="settings-section">
                <div className="settings-section-title" style={{ fontWeight: '700', marginBottom: '20px' }}>Data & Privacy</div>
                {['Allow doctor access', 'Receive automated alerts', 'Share data with caregiver'].map((label, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '14px' }}>{label}</span>
                        <input type="checkbox" defaultChecked />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="page" style={{ padding: '24px' }}>
            <div className="section-header" style={{ marginBottom: '24px' }}>
                <h1 className="section-title" style={{ fontSize: '22px' }}>Settings</h1>
                <p className="section-sub">Manage profile and preferences for {patient.name}</p>
            </div>
            <div className="settings-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
                <div className="settings-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries({ profile: 'Profile', language: 'Language', privacy: 'Privacy & Data' }).map(([k, v]) => (
                        <div
                            key={k}
                            className={`settings-nav-item ${activeTab === k ? 'active' : ''}`}
                            onClick={() => setActiveTab(k)}
                            style={{
                                padding: '10px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                                background: activeTab === k ? 'var(--blue-light)' : 'transparent',
                                color: activeTab === k ? 'var(--blue)' : 'var(--text-secondary)',
                                fontWeight: activeTab === k ? '600' : '400'
                            }}
                        >
                            {v}
                        </div>
                    ))}
                </div>
                <div className="card" style={{ background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    {renderSettingsContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;