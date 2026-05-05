import React, { useEffect, useState } from 'react';
import './index.css';
import './App.css';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import User from './pages/User';
import Doctor from './pages/Doctor';
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
      {/* <User page={page} setPage={setPage}/> */}
      <Doctor 
        page={page} 
        setPage={setPage} 
      />
      <button className="theme-toggle-fixed" onClick={toggleDark}>
        {darkMode ? '☀️' : '🌙'}
      </button>

    </>
  );
}

export default App;