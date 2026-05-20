import React, { useState, useEffect } from 'react';

const getId = (item) => item?.id || item?._id;

const FollowUps = ({ dashboard, loading, error }) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (dashboard?.followUps) {
            const savedStatuses = JSON.parse(localStorage.getItem('smriti_followup_statuses')) || {};
            const updatedAppointments = dashboard.followUps.map(a => {
                const followUpId = getId(a);
                if (savedStatuses[followUpId]) {
                    return { ...a, status: savedStatuses[followUpId] };
                }
                return a;
            });
            setAppointments(updatedAppointments);
        }
    }, [dashboard?.followUps]);

    const updateStatus = (id, newStatus) => {
        setAppointments(prev => prev.map(a => getId(a) === id ? { ...a, status: newStatus } : a));
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
                    <div className="tbl-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Patient</th><th>Risk</th><th>Scheduled</th><th>Type</th><th>Status</th><th>Reason</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((p) => {
                                const followUpId = getId(p);
                                return (
                                <tr key={followUpId}>
                                    <td>{p.name}</td>
                                    <td><span className={`badge ${p.risk === 'High' ? 'br' : p.risk === 'Moderate' ? 'ba' : 'bg'}`}>{p.risk}</span></td>
                                    <td style={{ fontFamily: 'var(--mono)' }}>{p.followUp || 'Needs scheduling'}</td>
                                    <td>{p.type}</td>
                                    <td><span className={`badge ${p.status === 'PENDING' ? 'ba' : p.status === 'UPCOMING' ? 'ba' : 'bg'}`}>{p.status}</span></td>
                                    <td style={{ color: 'var(--b3)', fontSize: '12px' }}>{p.notes}</td>
                                    <td>
                                        {p.status === 'PENDING' && (
                                            <button className="btn btn-g btn-sm" onClick={() => handleMarkSeen(followUpId)}>Mark Seen</button>
                                        )}
                                        {p.status === 'UPCOMING' && (
                                            <button className="btn btn-v btn-sm" onClick={() => handleConfirm(followUpId)}>Confirm</button>
                                        )}
                                        {(p.status === 'CONFIRMED' || p.status === 'SEEN') && (
                                            <span style={{ fontSize: '12px', color: 'var(--b4)' }}>Done</span>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowUps;
