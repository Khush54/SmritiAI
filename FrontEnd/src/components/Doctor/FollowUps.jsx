import React, { useState, useEffect } from 'react';

const FollowUps = ({ dashboard, loading, error }) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (dashboard?.followUps) {
            const savedStatuses = JSON.parse(localStorage.getItem('smriti_followup_statuses')) || {};
            const updatedAppointments = dashboard.followUps.map(a => {
                if (savedStatuses[a.id]) {
                    return { ...a, status: savedStatuses[a.id] };
                }
                return a;
            });
            setAppointments(updatedAppointments);
        }
    }, [dashboard?.followUps]);

    const updateStatus = (id, newStatus) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        const savedStatuses = JSON.parse(localStorage.getItem('smriti_followup_statuses')) || {};
        savedStatuses[id] = newStatus;
        localStorage.setItem('smriti_followup_statuses', JSON.stringify(savedStatuses));
    };

    const handleConfirm = (id) => updateStatus(id, 'CONFIRMED');
    const handleMarkSeen = (id) => updateStatus(id, 'SEEN');

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
                                <th>Patient</th><th>Risk</th><th>Scheduled</th><th>Type</th><th>Status</th><th>Reason</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td><span className={`badge ${p.risk === 'High' ? 'br' : p.risk === 'Moderate' ? 'ba' : 'bg'}`}>{p.risk}</span></td>
                                    <td style={{ fontFamily: 'var(--mono)' }}>{p.followUp || 'Needs scheduling'}</td>
                                    <td>{p.type}</td>
                                    <td><span className={`badge ${p.status === 'PENDING' ? 'ba' : p.status === 'UPCOMING' ? 'ba' : 'bg'}`}>{p.status}</span></td>
                                    <td style={{ color: 'var(--b3)', fontSize: '12px' }}>{p.notes}</td>
                                    <td>
                                        {p.status === 'PENDING' && (
                                            <button className="btn btn-g btn-sm" onClick={() => handleMarkSeen(p.id)}>Mark Seen</button>
                                        )}
                                        {p.status === 'UPCOMING' && (
                                            <button className="btn btn-v btn-sm" onClick={() => handleConfirm(p.id)}>Confirm</button>
                                        )}
                                        {(p.status === 'CONFIRMED' || p.status === 'SEEN') && (
                                            <span style={{ fontSize: '12px', color: 'var(--b4)' }}>Done</span>
                                        )}
                                    </td>
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
