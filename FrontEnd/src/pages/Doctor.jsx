import React, { useState } from 'react';
import Navbar from '../components/Doctor/Navbar';
import Sidebar from '../components/Doctor/Sidebar';
import Home from '../components/Doctor/Home';
import Alerts from '../components/Doctor/Alerts';
import Settings from '../components/Doctor/Settings'; 
import Patients from '../components/Doctor/Patients';
import Reports from '../components/Doctor/Reports';
import Analytics from '../components/Doctor/Analytics';
import Notes from '../components/Doctor/Notes';
import FollowUps from '../components/Doctor/FollowUps';

function Doctor({ page, setPage }) {
    const [searchQuery, setSearchQuery] = useState("");

    // 2. Lifted User Data state so Settings can modify it
    const [userData, setUserData] = useState({
        name: "Dr. Priya Sharma",
        initials: "PS",
        role: "NEUROLOGIST",
        portalType: "DOCTOR PORTAL",
        hasNotifications: false,
        specialization: "Cognitive Neurology",
        license: "MC-99210-A",
        email: "priya.sharma@hospital.com",
        clinic: "City Neuro Centre",
        preferredLanguage: "en"
    });

    const handleSearch = (query) => {
        setSearchQuery(query);
        console.log("Searching for:", query);
    };

    // 3. Handler to update doctor data from the Settings component
    const handleUpdateDoctor = (newData) => {
        // Create new initials if the name changed
        const names = newData.name.split(' ');
        const initials = names.map(n => n[0]).join('').toUpperCase();
        
        setUserData({
            ...newData,
            initials: initials
        });
    };

    return (
        <div className="portal-container doctor-scope">
            <Navbar
                user={userData}
                setPage={setPage}
                onSearch={handleSearch}
            />

            <div className="dash-layout">
                <Sidebar currentPage={page} setPage={setPage} />

                <div className="main-content">
                    {page === 'home' && <Home setPage={setPage}/>}
                    {page === 'patients' && <Patients/>}
                    {page === 'reports' && <Reports/>}
                    {page === 'analytics' && <Analytics/>}
                    {page === 'followups' && <FollowUps/>}
                    {page === 'notes' && <Notes/>}
                    {page === 'alerts' && <Alerts />}
                    {page === 'settings' && (
                        <Settings 
                            doctorData={userData} 
                            onUpdateDoctor={handleUpdateDoctor} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Doctor;