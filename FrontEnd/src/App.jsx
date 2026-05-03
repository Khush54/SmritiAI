import React, { useEffect, useState } from 'react';
import './index.css';
import './App.css';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Patient from './pages/Patient';
import Caregiver from './pages/Caregiver';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState('landing');


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
      {/* {page === 'landing' && <LandingPage setPage={setPage} page={page} darkMode={darkMode} toggleDark={toggleDark} />}
      {page === 'auth' && <Auth setPage={setPage} />} */}
      {/* <Patient page={page} setPage={setPage}/> */}
      <Caregiver page={page} setPage={setPage}/>
      <button className="theme-toggle-fixed" onClick={toggleDark}>
        {darkMode ? '☀️' : '🌙'}
      </button>

    </>
  );
}

export default App;