import React, { useContext } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
import { AppContext } from '../context/AppContext'
import { submitAssessment } from '../services/assessmentService'

function User() {
  const navigate = useNavigate();
  const { 
    user, patients, selectedPatient, setSelectedPatient, 
    alerts, addPatient, updatePatient 
  } = useContext(AppContext);
  
  const userName = user?.fullName || user?.name || "User";

  const handleCompleteTest = async (testData) => {
    try {
      if (!selectedPatient) return;
      const res = await submitAssessment(selectedPatient.id, testData);
      
      if (res.success && res.data.patient) {
        // Update context with the newly calculated scores
        updatePatient(res.data.patient);
      }
      
      navigate('/user/reports');
    } catch(err) {
      console.error("Failed to submit test", err);
      // Fallback navigation
      navigate('/user/reports');
    }
  };

  return (
    <div className="user-scope">
      <Navbar caregiverName={userName} alertCount={alerts.length} />

      <div className="dash-layout">
        <Sidebar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="home" replace />} />
            
            <Route path="home" element={
              <Home patients={patients} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} />
            } />
            
            <Route path="patients" element={
              <Patients patients={patients} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} onAddPatient={addPatient} />
            } />
            
            <Route path="test" element={
              <StartTest patient={selectedPatient} completeTest={handleCompleteTest} />
            } />
            
            <Route path="reports" element={<Reports patient={selectedPatient} />} />
            <Route path="mood" element={<Mood patient={selectedPatient} />} />
            <Route path="reminders" element={<Reminders patient={selectedPatient} />} />
            <Route path="history" element={<TestHistory patient={selectedPatient} />} />
            
            <Route path="alerts" element={
              <Alerts alertsData={alerts} patients={patients} setSelectedPatient={setSelectedPatient} />
            } />
            
            <Route path="doctor" element={<DoctorContact patient={selectedPatient} />} />
            
            <Route path="settings" element={
              <Settings patient={selectedPatient} onUpdatePatient={updatePatient} />
            } />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default User;