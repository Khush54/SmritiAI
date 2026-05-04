import React, { useState } from 'react'
import Navbar from '../components/User/Navbar'
import Sidebar from '../components/User/Sidebar'
import Home from '../components/User/Home'
import Patients from '../components/User/Patients'
import StartTest from '../components/User/StartTest'
import Reports from '../components/User/Reports'
import Reminders from '../components/User/Reminders'
import TestHistory from '../components/User/TestHistory'
import Settings from '../components/User/Settings'
import Alerts from '../components/User/Alerts'
import Mood from '../components/User/Mood'
import DoctorContact from '../components/User/DoctorContact'

function User({ page, setPage }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [alerts, setAlerts] = useState([]);


  const handleAddPatient = (newPatient) => {
    setPatients(prev => [...prev, newPatient]);

    const newAlert = {
      id: Date.now(),
      patientId: newPatient.id,
      patientName: newPatient.name,
      title: 'Profile Created',
      message: `Successfully added ${newPatient.name} to monitoring.`,
      type: 'success',
      time: 'Now'
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleUpdatePatient = (updatedData) => {
    setPatients(prev => prev.map(p =>
      p.id === updatedData.id ? { ...p, ...updatedData } : p
    ));

    if (selectedPatient && selectedPatient.id === updatedData.id) {
      setSelectedPatient({ ...selectedPatient, ...updatedData });
    }
  };

  const handleCompleteTest = () => {
    setPage('reports');
  };

  return (
    <>
      <Navbar
        setPage={setPage}
        caregiverName="Anita Singh"
        alertCount={alerts.length}
      />

      <div className="dash-layout">
        <Sidebar setPage={setPage} currentPage={page} />

        <div className="main-content">
          {page === 'home' && (
            <Home
              patients={patients}
              setPage={setPage}
              setSelectedPatient={setSelectedPatient}
            />
          )}

          {page === 'patients' && (
            <Patients
              patients={patients}
              setPage={setPage}
              setSelectedPatient={setSelectedPatient}
              onAddPatient={handleAddPatient}
            />
          )}

          {page === 'test' && (
            <StartTest
              patient={selectedPatient}
              setPage={setPage}
              completeTest={handleCompleteTest}
            />
          )}

          {page === 'reports' && <Reports patient={selectedPatient} />}
          {page === 'mood' && <Mood patient={selectedPatient} setPage={setPage} />}
          {page === 'reminders' && <Reminders patient={selectedPatient} />}

          {page === 'history' && <TestHistory patient={selectedPatient} />}

          {page === 'alerts' && (
            <Alerts
              alertsData={alerts}
              patients={patients}
              setSelectedPatient={setSelectedPatient}
              setPage={setPage}
            />
          )}
          {page === 'doctor' && <DoctorContact patient={selectedPatient} setPage={setPage} />}
          {page === 'settings' && (
            <Settings
              patient={selectedPatient}
              onUpdatePatient={handleUpdatePatient}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default User;