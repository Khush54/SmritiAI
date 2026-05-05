import React, { useState } from 'react';
import Navbar from '../components/Doctor/Navbar';
import Sidebar from '../components/Doctor/Sidebar';

function Doctor({ page, setPage }) {
    const [searchQuery, setSearchQuery] = useState("");

    const [userData] = useState({
        name: "Dr. Priya Sharma",
        initials: "PS",
        role: "NEUROLOGIST",
        portalType: "DOCTOR PORTAL",
        hasNotifications: true
    });
    const handleSearch = (query) => {
        setSearchQuery(query);
        // You can now filter your patient lists or records based on searchQuery
        console.log("Searching for:", query);
    };

    return (
        <div className="portal-container">
            <Navbar
                user={userData}
                setPage={setPage}
                onSearch={handleSearch}
            />

            <div className="dash-layout">
                <Sidebar currentPage={page} setPage={setPage} />

                <div className="main-content">

                    {/* Dynamic Content goes here based on 'page' */}
                </div>
            </div>
        </div>
    );
}

export default Doctor;