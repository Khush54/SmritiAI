import React, { useState, useEffect } from 'react';
function Settings({ doctorData, onUpdateDoctor }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [selectedLang, setSelectedLang] = useState('en');
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (doctorData) {
            setFormData({
                firstName: doctorData.name?.split(' ')[0] || '',
                lastName: doctorData.name?.split(' ')[1] || '',
                specialization: doctorData.specialization || '',
                license: doctorData.license || '',
                email: doctorData.email || '',
                clinic: doctorData.clinic || '',
                location: doctorData.location || ''
            });
            setSelectedLang(doctorData.preferredLanguage || 'en');
        }
    }, [doctorData]);

    if (!doctorData) {
        return (
            <div className="page" style={{ textAlign: 'center', padding: '100px' }}>
                <h2 style={{ color: 'var(--c1)' }}>Loading Profile...</h2>
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
        { name: 'Marathi (ਮਰਾਠੀ)', code: 'mr' },
        { name: 'Gujarati (ગુજરાતી)', code: 'gu' },
        { name: 'Kannada (ಕನ್ನಡ)', code: 'kn' },
        { name: 'Malayalam (മലയാളਮ)', code: 'ml' }
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

    const handleSave = async () => {
        const updatedData = {
            ...doctorData,
            name: `${formData.firstName} ${formData.lastName}`,
            specialization: formData.specialization,
            license: formData.license,
            email: formData.email,
            clinic: formData.clinic,
            location: formData.location,
            preferredLanguage: selectedLang
        };
        try {
            await onUpdateDoctor(updatedData);
            alert(`Profile updated successfully, Dr. ${formData.lastName}`);
        } catch (error) {
            console.error("Doctor profile update failed", error);
            alert(error.response?.data?.message || "Unable to save profile changes.");
        }
    };

    const renderSettingsContent = () => {
        if (activeTab === 'profile') return (
            <div className="settings-section">
                <div className="settings-section-title" style={{ marginBottom: '20px', fontWeight: '700' }}>Professional Information</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px', fontWeight: '600' }}>
                        {doctorData.initials}
                    </div>
                    <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{doctorData.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{doctorData.role}</div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group"><label className="form-label">First Name</label>
                        <input type="text" className="form-input" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div className="form-group"><label className="form-label">Last Name</label>
                        <input type="text" className="form-input" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                    <div className="form-group"><label className="form-label">Specialization</label>
                        <input type="text" className="form-input" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
                    </div>
                    <div className="form-group"><label className="form-label">License Number</label>
                        <input type="text" className="form-input" value={formData.license} onChange={(e) => setFormData({...formData, license: e.target.value})} />
                    </div>
                    <div className="form-group"><label className="form-label">Email Address</label>
                        <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="form-group"><label className="form-label">Clinic Name</label>
                        <input type="text" className="form-input" value={formData.clinic} onChange={(e) => setFormData({...formData, clinic: e.target.value})} />
                    </div>
                    <div className="form-group"><label className="form-label">Practice City</label>
                        <input type="text" className="form-input" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                    </div>
                </div>
                <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            </div>
        );

        if (activeTab === 'language') return (
            <div className="settings-section">
                <div className="settings-section-title" style={{ fontWeight: '700', marginBottom: '10px' }}>Portal Language</div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                    Choose the interface language for your workspace.
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
                    ✅ Active Language: <strong className="notranslate">{languages.find(l => l.code === selectedLang)?.name}</strong>
                </div>
                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={handleSave}>Apply Language Globally</button>
            </div>
        );


    };

    return (
        <div className="page" style={{ padding: '24px' }}>
            <div className="section-header" style={{ marginBottom: '24px' }}>
                <h1 className="section-title" style={{ fontSize: '22px' }}>Settings</h1>
                <p className="section-sub">Manage your professional profile and portal preferences</p>
            </div>
            <div className="settings-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
                <div className="settings-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries({ profile: 'Profile', language: 'Language' }).map(([k, v]) => (
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
}

export default Settings;
