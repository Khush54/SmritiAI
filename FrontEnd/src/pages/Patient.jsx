import React from 'react'
import Sidebar from '../components/Patient/Sidebar'
import Home from '../components/Patient/Home'
import Navbar from '../components/Patient/Navbar'
import StartTest from '../components/Patient/StartTest'
import Reports from '../components/Patient/Reports'
import Reminders from '../components/Patient/Reminders'
import Settings from '../components/Patient/Settings'
import TestHistory from '../components/Patient/TestHistory'
import Alerts from '../components/Patient/Alerts'

function Patient({ page, setPage }) {

  const handleCompleteTest = () => {
    setPage('reports');
  };


  return (
    <>
      <Navbar setPage={setPage} />

      <div className="dash-layout">
        <Sidebar setPage={setPage} currentPage={page} />

        <div className="main-content">
          {page === 'home' && <Home setPage={setPage} />}

          {page === 'test' && (
            <StartTest
              setPage={setPage}
              completeTest={handleCompleteTest}
            />
          )}

          {page === 'reports' && <Reports />}
          {page === 'reminders' && <Reminders />}
          {page === 'history' && <TestHistory />}
          {page === 'settings' && <Settings />}
          {page === 'alerts' && <Alerts />}


        </div>
      </div>
    </>
  )
}

export default Patient;