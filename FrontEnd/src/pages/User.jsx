import React, { useContext, useState } from 'react'
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
import FeedbackPortal from '../components/User/FeedbackPortal'
import { AppContext } from '../context/AppContext'
import { getAlerts } from '../Services/alertService'

function User() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { 
    user, patients, selectedPatient, setSelectedPatient, 
    alerts, addPatient, updatePatient, showAlert 
  } = useContext(AppContext);
  
  const userName = user?.fullName || user?.name || "User";

  const handleCompleteTest = async (apiResponse) => {
    try {
      if (!selectedPatient || !apiResponse) return;
      
      if (apiResponse.success && apiResponse.data && apiResponse.data.patient) {
        updatePatient(apiResponse.data.patient);
        showAlert("Self-Assessment completed successfully! Reports updated.", "success");
      }
      
      navigate('/user/reports');
    } catch(err) {
      console.error("Failed to complete test", err);
      navigate('/user/reports');
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="user-scope">
      <Navbar caregiverName={userName} alertCount={unreadCount} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      <div className="dash-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
            <Route path="mood" element={<Mood patient={selectedPatient} onUpdatePatient={updatePatient} />} />
            <Route path="reminders" element={<Reminders patient={selectedPatient} />} />
            <Route path="history" element={<TestHistory patient={selectedPatient} />} />
            
            <Route path="alerts" element={
              <Alerts alertsData={alerts} patients={patients} setSelectedPatient={setSelectedPatient} />
            } />
            
            <Route path="doctor" element={<DoctorContact patient={selectedPatient} />} />
            <Route path="feedback" element={<FeedbackPortal />} />
            
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