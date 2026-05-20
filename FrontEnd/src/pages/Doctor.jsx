import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import Feedback from '../components/Doctor/Feedback';
import { getDoctorDashboard } from '../Services/doctorService';
import { updateUserProfile } from '../Services/authService';

function Doctor() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dashboard, setDashboard] = useState(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState("");

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
        location: "",
        preferredLanguage: "en"
    });

    const refreshDashboard = async () => {
        try {
            setDashboardLoading(true);
            setDashboardError("");
            const res = await getDoctorDashboard();
            setDashboard(res.data);
        } catch (error) {
            console.error("Doctor dashboard fetch failed", error);
            setDashboardError(error.response?.data?.message || "Unable to load assigned patients.");
            setDashboard(null);
        } finally {
            setDashboardLoading(false);
        }
    };

    useEffect(() => {
        refreshDashboard();
    }, []);

    useEffect(() => {
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
                    specialization: parsedUser.specialization || prev.specialization,
                    clinic: parsedUser.clinic || prev.clinic,
                    location: parsedUser.location || parsedUser.city || prev.location,
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

    const handleUpdateDoctor = async (newData) => {
        const names = newData.name.split(' ');
        const initials = names.map(n => n[0]).join('').toUpperCase();

        const profileRes = await updateUserProfile({
            fullName: newData.name.replace(/^Dr\.\s*|^Dr\s*/i, "").trim(),
            specialization: newData.specialization,
            license: newData.license,
            clinic: newData.clinic,
            location: newData.location,
            city: newData.location,
            preferredLanguage: newData.preferredLanguage
        });

        if (profileRes.success) {
            localStorage.setItem("user", JSON.stringify(profileRes.user));
            setUserData({
                ...newData,
                initials: initials
            });
        }
    };

    return (
        <div className="portal-container doctor-scope">
            <Navbar
                user={userData}
                onSearch={handleSearch}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>

            <div className="dash-layout">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    dashboard={dashboard}
                    loading={dashboardLoading}
                />

                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="home" replace />} />


                        <Route path="home" element={<Home dashboard={dashboard} loading={dashboardLoading} error={dashboardError} doctor={userData} />} />
                        <Route path="patients" element={<Patients dashboard={dashboard} loading={dashboardLoading} error={dashboardError} searchQuery={searchQuery} />} />
                        <Route path="reports" element={<Reports dashboard={dashboard} loading={dashboardLoading} error={dashboardError} />} />
                        <Route path="analytics" element={<Analytics dashboard={dashboard} loading={dashboardLoading} error={dashboardError} />} />
                        <Route path="followups" element={<FollowUps dashboard={dashboard} loading={dashboardLoading} error={dashboardError} refreshDashboard={refreshDashboard} />} />
                        <Route path="notes" element={<Notes dashboard={dashboard} loading={dashboardLoading} error={dashboardError} refreshDashboard={refreshDashboard} />} />
                        <Route path="alerts" element={<Alerts dashboard={dashboard} loading={dashboardLoading} error={dashboardError} />} />
                        <Route path="settings" element={
                            <Settings 
                                doctorData={userData} 
                                onUpdateDoctor={handleUpdateDoctor} 
                            />
                        } />
                        <Route path="feedback" element={<Feedback />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Doctor;
