import React, { useState, useEffect } from 'react';

const FollowUps = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(null); 
    const [selectedPatient, setSelectedPatient] = useState(null);
    
    const [newAppt, setNewAppt] = useState({ name: '', date: '', type: 'Neurology' });

    useEffect(() => {
        const fetchFollowUps = async () => {
            const mockData = [
                { id: 1, name: "Anita Rao", risk: "High", followUp: "2026-05-28", type: "Neurology", status: 'OVERDUE', notes: "Requires cognitive assessment." },
                { id: 2, name: "Suresh Gupta", risk: "High", followUp: "2026-05-30", type: "Video Consult", status: 'UPCOMING', notes: "Medication adjustment review." },
                { id: 3, name: "Meera Singh", risk: "Medium", followUp: "2026-06-05", type: "MRI Review", status: 'CONFIRMED', notes: "Check for hippocampal atrophy." }
            ];
            setAppointments(mockData);
            setLoading(false);
        };
        fetchFollowUps();
    }, []);


    const handleView = (patient) => {
        setSelectedPatient(patient);
        setShowModal('view');
    };

    const handleConfirm = (id) => {
        setAppointments(prev => prev.map(app => 
            app.id === id ? { ...app, status: 'CONFIRMED' } : app
        ));
    };

    const handleScheduleSubmit = (e) => {
        e.preventDefault();
        const id = appointments.length + 1;
        const newEntry = { ...newAppt, id, status: 'UPCOMING', risk: 'Medium' };
        setAppointments([...appointments, newEntry]);
        setShowModal(null);
        setNewAppt({ name: '', date: '', type: 'Neurology' });
    };

    if (loading) return <div className="page">Loading Tracker...</div>;

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>Follow-up Tracker</h1>
                        <p>{appointments.filter(a => a.status === 'OVERDUE').length} OVERDUE</p>
                    </div>
                    <button className="btn btn-c btn-sm" onClick={() => setShowModal('schedule')}>+ Schedule</button>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <table className="tbl">
                    <thead>
                        <tr>
                            <th>Patient</th><th>Risk</th><th>Scheduled</th><th>Type</th><th>Status</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((p) => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td><span className={`badge ${p.risk === 'High' ? 'br' : 'ba'}`}>{p.risk}</span></td>
                                <td style={{fontFamily:'var(--mono)'}}>{p.followUp}</td>
                                <td>{p.type}</td>
                                <td><span className={`badge ${p.status === 'OVERDUE' ? 'br' : p.status === 'UPCOMING' ? 'ba' : 'bg'}`}>{p.status}</span></td>
                                <td>
                                    <div style={{display:'flex', gap: '5px'}}>
                                        <button className="btn btn-g btn-sm" onClick={() => handleView(p)}>View</button>
                                        {p.status !== 'CONFIRMED' && <button className="btn btn-e btn-sm" onClick={() => handleConfirm(p.id)}>Confirm</button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            
            {showModal && (
                <div className="modal-overlay" style={overlayStyle}>
                    <div className="card" style={modalStyle}>
                        
                        {showModal === 'view' && selectedPatient && (
                            <>
                                <div className="sh-title">Patient Appointment Detail</div>
                                <div style={{margin: '15px 0', fontSize: '14px'}}>
                                    <p><strong>Name:</strong> {selectedPatient.name}</p>
                                    <p><strong>Scheduled:</strong> {selectedPatient.followUp}</p>
                                    <p><strong>Type:</strong> {selectedPatient.type}</p>
                                    <p style={{marginTop: '10px', color: 'var(--b3)'}}><em>Notes: {selectedPatient.notes}</em></p>
                                </div>
                                <button className="btn btn-c btn-sm" onClick={() => setShowModal(null)}>Close</button>
                            </>
                        )}

                        {showModal === 'schedule' && (
                            <>
                                <div className="sh-title">Schedule New Appointment</div>
                                <form onSubmit={handleScheduleSubmit}>
                                    <div className="field">
                                        <label className="flabel">Patient Name</label>
                                        <input className="finput" required value={newAppt.name} onChange={e => setNewAppt({...newAppt, name: e.target.value})} />
                                    </div>
                                    <div className="field">
                                        <label className="flabel">Date</label>
                                        <input className="finput" type="date" required value={newAppt.date} onChange={e => setNewAppt({...newAppt, followUp: e.target.value})} />
                                    </div>
                                    <div style={{display:'flex', gap: '10px', marginTop: '15px'}}>
                                        <button type="submit" className="btn btn-c">Save Appointment</button>
                                        <button type="button" className="btn btn-g" onClick={() => setShowModal(null)}>Cancel</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
    background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};

const modalStyle = {
    width: '400px', padding: '24px', border: '1px solid var(--border)', background: 'var(--navy-2)'
};

export default FollowUps;