import React, { createContext, useState, useEffect } from 'react';
import { getPatients } from '../services/patientService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // 1. Load User from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    // 2. Load Patients from backend
    const fetchPatients = async () => {
      try {
        const res = await getPatients();
        if (res.success) {
          setPatients(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch patients", error);
      }
    };
    
    if (localStorage.getItem("token")) {
      fetchPatients();
    }
  }, []);

  const addPatient = (newPatient) => {
    setPatients(prev => [newPatient, ...prev]);

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

  const updatePatient = (updatedData) => {
    setPatients(prev => prev.map(p =>
      p.id === updatedData.id ? { ...p, ...updatedData } : p
    ));

    if (selectedPatient && selectedPatient.id === updatedData.id) {
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
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};
