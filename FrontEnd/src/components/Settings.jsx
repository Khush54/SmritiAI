import React, { useState } from 'react';

function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [selectedLang, setSelectedLang] = useState('en');

    // Language list with codes for Google Translate integration
    const languages = [
        { name: 'English', code: 'en' },
        { name: 'Hindi (हिंदी)', code: 'hi' },
        { name: 'Punjabi (ਪੰਜਾਬੀ)', code: 'pa' },
        { name: 'Bengali (বাংলা)', code: 'bn' },
        { name: 'Tamil (தமிழ்)', code: 'ta' },
        { name: 'Telugu (తెలుగు)', code: 'te' },
        { name: 'Marathi (मराठी)', code: 'mr' },
        { name: 'Gujarati (ગુજરાਤੀ)', code: 'gu' },
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

    const renderSettingsContent = () => {
        if (activeTab === 'profile') return (
            <div className="settings-section">
                <div className="settings-section-title">Personal Information</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px', fontWeight: '600' }}>RK</div>
                    <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Ramesh Kumar</div>
                        <button className="btn btn-secondary btn-sm">Change Photo</button>
                    </div>
                </div>
                <div className="grid-2">
                    <div className="form-group"><label className="form-label">First Name</label><input type="text" className="form-input" defaultValue="Ramesh" /></div>
                    <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-input" defaultValue="Kumar" /></div>
                    <div className="form-group"><label className="form-label">Age</label><input type="number" className="form-input" defaultValue="72" /></div>
                    <div className="form-group"><label className="form-label">Gender</label><select className="form-input form-select"><option>Male</option><option>Female</option><option>Other</option></select></div>
                    <div className="form-group"><label className="form-label">Phone</label><input type="text" className="form-input" defaultValue="+91 98765 43210" /></div>
                    <div className="form-group"><label className="form-label">City</label><input type="text" className="form-input" defaultValue="Delhi" /></div>
                </div>
                <div className="form-group"><label className="form-label">Doctor / Neurologist (if assigned)</label><input type="text" className="form-input" defaultValue="Dr. Priya Sharma, AIIMS Delhi" /></div>
                <button className="btn btn-primary">Save Changes</button>
            </div>
        );

        if (activeTab === 'language') return (
            <div className="settings-section">
                <div className="settings-section-title">Preferred Test Language</div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>Choose your language for tests, instructions, and reports. All 10+ Indian languages are fully supported.</p>
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
                                border: '1px solid var(--border)'
                            }}
                        >
                            {l.name}
                        </div>
                    ))}
                </div>
                <div style={{ background: 'var(--blue-light)', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: '13px', color: 'var(--blue)' }}>
                    ✅ Selected: <strong className="notranslate">{languages.find(l => l.code === selectedLang)?.name}</strong> — all future tests and reports will use this language.
                </div>
            </div>
        );

        if (activeTab === 'privacy') return (
            <div className="settings-section">
                <div className="settings-section-title">Data & Privacy</div>
                {[
                    { label: 'Share anonymised data for AI research', sub: 'Helps improve Smriti AI for all users.' },
                    { label: 'Allow doctor access to my reports', sub: 'Your assigned doctor can view your test reports.' },
                    { label: 'Share data with family caregiver', sub: 'Your caregiver account can view your test results.' },
                    { label: 'Receive automated AI alerts', sub: 'Get notified if your score changes significantly.' },
                ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)', gap: '20px' }}>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '3px' }}>{s.label}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{s.sub}</div>
                        </div>
                        <input type="checkbox" defaultChecked />
                    </div>
                ))}
                <div className="settings-section" style={{ marginTop: '24px', padding: '0' }}>
                    <div className="settings-section-title">Danger Zone</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>Delete All Test Data</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Permanently delete all cognitive test results</div>
                        </div>
                        <button className="btn btn-danger btn-sm">Delete Data</button>
                    </div>
                </div>
            </div>
        );

        if (activeTab === 'notifications') return (
            <div className="settings-section">
                <div className="settings-section-title">Notification Preferences</div>
                {['Test reminders', 'Doctor follow-up alerts', 'Score change alerts', 'Health tips & articles', 'Appointment reminders'].map((n, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)', gap: '20px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{n}</div>
                        <input type="checkbox" defaultChecked />
                    </div>
                ))}
                <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Preferred channel</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['SMS / WhatsApp', 'Email', 'Push'].map(c => <button key={c} className="btn btn-secondary btn-sm">{c}</button>)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="page" style={{ padding: '24px' }}>
            <div className="section-header" style={{ marginBottom: '24px' }}>
                <h1 className="section-title" style={{ fontSize: '22px' }}>Settings</h1>
                <p className="section-sub">Manage your account and preferences</p>
            </div>
            <div className="settings-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
                <div className="settings-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries({ profile: 'Profile', language: 'Language', privacy: 'Privacy & Data', notifications: 'Notifications' }).map(([k, v]) => (
                        <div
                            key={k}
                            className={`settings-nav-item ${activeTab === k ? 'active' : ''}`}
                            onClick={() => setActiveTab(k)}
                            style={{
                                padding: '10px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                                background: activeTab === k ? 'var(--blue-light)' : 'transparent',
                                color: activeTab === k ? 'var(--blue)' : 'var(--text-secondary)'
                            }}
                        >
                            {v}
                        </div>
                    ))}
                </div>
                <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    {renderSettingsContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;