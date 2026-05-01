import React from 'react'
import Sidebar from '../components/Sidebar'
import DashboardPatient from '../components/DashboardPatient'
import PortalNavbar from '../components/PortalNavbar'
import StartTest from '../components/StartTest'
import Reports from '../components/Reports'
import Recommendation from '../components/Recommendation'
import Settings from '../components/Settings'

function Patient({ page, setPage }) {
  const handleCompleteTest = () => {
    setPage('dashboard');
  };

  return (
    <>
      <PortalNavbar setPage={setPage} />

      <div className="dash-layout">
        <Sidebar setPage={setPage} currentPage={page} />

        <div className="main-content">
          {page === 'dashboard' && <DashboardPatient />}
          
          {page === 'test' && (
            <StartTest 
              setPage={setPage} 
              completeTest={handleCompleteTest} 
            />
          )}
          
          {page === 'reports' && <Reports />}
          {page === 'recommendation' && <Recommendation />}
          {page === 'settings' && <Settings />}
        </div>
      </div>
    </>
  )
}

export default Patient;