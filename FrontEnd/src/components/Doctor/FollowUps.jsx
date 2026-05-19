import React from 'react';

const FollowUps = ({ dashboard, loading, error }) => {
    const appointments = dashboard?.followUps || [];

    if (loading) return <div className="page">Loading follow-up tracker...</div>;
    if (error) return <div className="page"><div className="card">{error}</div></div>;

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>Follow-up Tracker</h1>
                        <p>{appointments.filter(a => a.status === 'PENDING').length} PENDING</p>
                    </div>
                </div>
            </div>

            <div className="card">
                {appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '44px', color: 'var(--b3)' }}>No assigned patient follow-ups yet.</div>
                ) : (
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Patient</th><th>Risk</th><th>Scheduled</th><th>Type</th><th>Status</th><th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td><span className={`badge ${p.risk === 'High' ? 'br' : p.risk === 'Moderate' ? 'ba' : 'bg'}`}>{p.risk}</span></td>
                                    <td style={{ fontFamily: 'var(--mono)' }}>{p.followUp || 'Needs scheduling'}</td>
                                    <td>{p.type}</td>
                                    <td><span className={`badge ${p.status === 'PENDING' ? 'ba' : 'bg'}`}>{p.status}</span></td>
                                    <td style={{ color: 'var(--b3)', fontSize: '12px' }}>{p.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default FollowUps;
