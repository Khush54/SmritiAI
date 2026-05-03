import React from 'react'
import Navbar from '../components/Caregiver/Navbar'
import Sidebar from '../components/Caregiver/Sidebar'
import Home from '../components/Caregiver/Home'
import Patients from '../components/Caregiver/Patients'

function Caregiver({page, setPage}) {
    return (
        <>
            <Navbar setPage={setPage} />

            <div className="dash-layout">
                <Sidebar setPage={setPage} currentPage={page} />

                <div className="main-content">
                    {page === 'home' && <Home setPage={setPage} />}
                    {page === 'patients' && <Patients/>}

          {/* {page === 'test' && (
            <StartTest
              setPage={setPage}
              completeTest={handleCompleteTest}
            />
          )}

          {page === 'reports' && <Reports />}
          {page === 'reminders' && <Reminders />}
          {page === 'history' && <TestHistory />}
          {page === 'settings' && <Settings />}
          {page === 'alerts' && <Alerts />} */}


                </div>
            </div>
        </>
    )
}

export default Caregiver