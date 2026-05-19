import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './App.css';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import User from './pages/User';
import Doctor from './pages/Doctor';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    console.error("Failed to parse user");
  }

  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/home`} replace />;
  }

  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-dark",
      darkMode ? "true" : "false"
    );
  }, [darkMode]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage darkMode={darkMode} toggleDark={toggleDark} />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/user/*" element={
          <ProtectedRoute allowedRole="user">
            <User />
          </ProtectedRoute>
        } />
        <Route path="/doctor/*" element={
          <ProtectedRoute allowedRole="doctor">
            <Doctor />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <button className="theme-toggle-fixed" onClick={toggleDark}>
        {darkMode ? '☀️' : '🌙'}
      </button>
    </>
  );
}

export default App;
