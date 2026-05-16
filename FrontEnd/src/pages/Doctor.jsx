import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const [userData, setUserData] = useState({
        name: "Dr. Doctor",
        initials: "DR",
        role: "NEUROLOGIST",
        portalType: "DOCTOR PORTAL",
        hasNotifications: false,
        specialization: "Cognitive Neurology",
        license: "MC-99210-A",
        email: "doctor@hospital.com",
        clinic: "City Neuro Centre",
        preferredLanguage: "en"
    });

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const fullName = parsedUser.fullName || parsedUser.name || "Doctor";
                let displayName = fullName;
                if (!displayName.toLowerCase().startsWith("dr.") && !displayName.toLowerCase().startsWith("dr ")) {
                    displayName = "Dr. " + displayName;
                }
                const names = displayName.replace(/^Dr\.\s*|^Dr\s*/i, "").trim().split(' ');
                const initials = names.map(n => n[0]).join('').toUpperCase().substring(0, 2);
                
                setUserData(prev => ({
                    ...prev,
                    name: displayName,
                    initials: initials,
                    email: parsedUser.email || prev.email,
                }));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        console.log("Searching for:", query);
    };

    const handleUpdateDoctor = (newData) => {
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
                onSearch={handleSearch}
            />

            <div className="dash-layout">
                <Sidebar />

                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="home" replace />} />
                        <Route path="home" element={<Home />} />
                        <Route path="patients" element={<Patients />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="followups" element={<FollowUps />} />
                        <Route path="notes" element={<Notes />} />
                        <Route path="alerts" element={<Alerts />} />
                        <Route path="settings" element={
                            <Settings 
                                doctorData={userData} 
                                onUpdateDoctor={handleUpdateDoctor} 
                            />
                        } />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Doctor;