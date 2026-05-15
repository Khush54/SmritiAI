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

function User() {
  const [userPage, setuserPage] = useState("home")
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
    setuserPage('reports');
  };

  return (
    <div className="user-scope">
      <Navbar
        setPage={setuserPage}
        caregiverName="Anita Singh"
        alertCount={alerts.length}
      />

      <div className="dash-layout">
        <Sidebar setPage={setuserPage} currentPage={userPage} />

        <div className="main-content">
          {userPage === 'home' && (
            <Home
              patients={patients}
              setPage={setuserPage}
              setSelectedPatient={setSelectedPatient}
            />
          )}

          {userPage === 'patients' && (
            <Patients
              patients={patients}
              setPage={setuserPage}
              setSelectedPatient={setSelectedPatient}
              onAddPatient={handleAddPatient}
            />
          )}

          {userPage === 'test' && (
            <StartTest
              patient={selectedPatient}
              setPage={setuserPage}
              completeTest={handleCompleteTest}
            />
          )}

          {userPage === 'reports' && <Reports patient={selectedPatient} />}
          {userPage === 'mood' && <Mood patient={selectedPatient} setPage={setuserPage} />}
          {userPage === 'reminders' && <Reminders patient={selectedPatient} />}

          {userPage === 'history' && <TestHistory patient={selectedPatient} />}

          {userPage === 'alerts' && (
            <Alerts
              alertsData={alerts}
              patients={patients}
              setSelectedPatient={setSelectedPatient}
              setPage={setuserPage}
            />
          )}
          {userPage === 'doctor' && <DoctorContact patient={selectedPatient} setPage={setuserPage} />}
          {userPage === 'settings' && (
            <Settings
              patient={selectedPatient}
              onUpdatePatient={handleUpdatePatient}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default User;