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

function Doctor() {
    const [doctorPage, setdoctorPage] = useState("home");
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
                setPage={setdoctorPage}
                onSearch={handleSearch}
            />

            <div className="dash-layout">
                <Sidebar currentPage={doctorPage} setPage={setdoctorPage} />

                <div className="main-content">
                    {doctorPage === 'home' && <Home setdoctorPage={setdoctorPage}/>}
                    {doctorPage === 'patients' && <Patients/>}
                    {doctorPage === 'reports' && <Reports/>}
                    {doctorPage === 'analytics' && <Analytics/>}
                    {doctorPage === 'followups' && <FollowUps/>}
                    {doctorPage === 'notes' && <Notes/>}
                    {doctorPage === 'alerts' && <Alerts />}
                    {doctorPage === 'settings' && (
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