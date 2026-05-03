import React from 'react';

function Patients({ patients = [], onNavigate }) {
    // Helper to determine score color based on value
    const getScoreColor = (score) => {
        if (score < 50) return "var(--rose)";
        if (score < 75) return "var(--warm)";
        return "var(--sage)";
    };

    // Helper for the Risk Badge component
    const RiskBadge = ({ risk }) => {
        const className = risk === 'High' ? 'badge br' : 'badge bg';
        return <span className={className}>{risk} Risk</span>;
    };

    return (
        <div className="page">
            {/* ── HEADER ── */}
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>My Patients</h1>
                        <p>Monitoring {patients.length} family members</p>
                    </div>
                    <button className="btn btn-p btn-sm" onClick={() => onNavigate?.('add-patient')}>
                        + Add Patient
                    </button>
                </div>
            </div>

            {/* ── PATIENT LIST ── */}
            {patients.length > 0 ? (
                patients.map((p) => (
                    <div key={p.id} className="card" style={{ marginBottom: '16px' }}>
                        {/* Top Row: Profile & Score */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', flexWrap: 'wrap' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: `linear-gradient(135deg, ${p.risk === 'High' ? '#F43F5E, #EF4444' : '#10B981, #0EA5E9'})`,
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
                                    Age {p.age} · {p.doctor} · {p.location}
                                </div>
                            </div>

                            <RiskBadge risk={p.risk} />

                            <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', color: getScoreColor(p.score) }}>
                                {p.score}<span style={{ fontSize: '14px', color: 'var(--c4)', fontWeight: 400 }}>/100</span>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="g4" style={{ gap: '12px', marginBottom: '16px' }}>
                            {[
                                { label: 'Mood', value: p.mood },
                                { label: 'Sleep', value: p.sleep },
                                { label: 'Appetite', value: p.appetite },
                                { label: 'Trend', value: p.trend === 'declining' ? '📉 Declining' : '📊 Stable' }
                            ].map((stat, idx) => (
                                <div key={idx} style={{ background: 'var(--c8)', borderRadius: 'var(--r10)', padding: '12px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--c4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                                        {stat.label}
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--c1)' }}>
                                        {stat.value || '--'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Notes Section */}
                        <div style={{
                            background: 'var(--c8)',
                            borderRadius: 'var(--r10)',
                            padding: '13px',
                            marginBottom: '14px',
                            borderLeft: `3px solid ${p.risk === 'High' ? '#F43F5E' : '#10B981'}`
                        }}>
                            <p style={{ fontSize: '13px', color: 'var(--c2)', lineHeight: 1.6, fontStyle: 'italic' }}>
                                "{p.notes || 'No recent notes available.'}"
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button className="btn btn-s btn-sm">📊 Full Report</button>
                            <button className="btn btn-s btn-sm">💊 Medications</button>
                            <button className="btn btn-s btn-sm" onClick={() => onNavigate?.('log')}>📝 Log Entry</button>
                            {p.risk === 'High' && (
                                <button className="btn btn-r btn-sm">📞 Call Doctor</button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                /* Empty State */
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--c3)' }}>No patients found.</p>
                </div>
            )}
        </div>
    );
}

export default Patients;