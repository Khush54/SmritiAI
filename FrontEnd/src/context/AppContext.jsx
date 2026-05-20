import React, { createContext, useState, useEffect } from 'react';
import { getPatients } from '../Services/patientService';
import { getAlerts, markAlertsRead } from '../Services/alertService';
import AlertModal from '../components/User/AlertModal';

export const AppContext = createContext();
const getId = (item) => item?.id || item?._id;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [customAlert, setCustomAlert] = useState({ isOpen: false, message: '', type: 'info' });

  const showAlert = (message, type = 'info') => {
    setCustomAlert({ isOpen: true, message, type });
  };

  const closeAlert = () => {
    setCustomAlert(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
    const fetchData = async () => {
      try {
        const [patientsRes, alertsRes] = await Promise.all([
          getPatients(),
          getAlerts()
        ]);
        
        if (patientsRes.success) setPatients(patientsRes.data);
        if (alertsRes.success) setAlerts(alertsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    
    if (localStorage.getItem("token")) {
      fetchData();
    }
  }, []);

  const markAllAlertsAsRead = async () => {
    try {
      await markAlertsRead();
      setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    } catch (error) {
      console.error("Failed to mark alerts as read", error);
    }
  };

  const addPatient = (newPatient) => {
    setPatients(prev => [newPatient, ...prev]);

    const newAlert = {
      id: Date.now(),
      patientId: getId(newPatient),
      patientName: newPatient.name,
      title: 'Profile Created',
      message: `Successfully added ${newPatient.name} to monitoring.`,
      type: 'success',
      time: 'Now',
      read: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const updatePatient = (updatedData) => {
    setPatients(prev => prev.map(p =>
      getId(p) === getId(updatedData) ? { ...p, ...updatedData } : p
    ));

    if (selectedPatient && getId(selectedPatient) === getId(updatedData)) {
      setSelectedPatient({ ...selectedPatient, ...updatedData });
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPatients([]);
    setSelectedPatient(null);
    setAlerts([]);
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      patients, setPatients, addPatient, updatePatient,
      selectedPatient, setSelectedPatient,
      alerts, setAlerts,
      logout,
      showAlert,
      markAllAlertsAsRead
    }}>
      {children}
      <AlertModal 
        isOpen={customAlert.isOpen} 
        message={customAlert.message} 
        type={customAlert.type} 
        onClose={closeAlert} 
      />
    </AppContext.Provider>
  );
};
