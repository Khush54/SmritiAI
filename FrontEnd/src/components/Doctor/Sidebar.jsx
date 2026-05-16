import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Doctor.css'

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname.includes(path) ? "on" : "";

    return (
        <aside className="sidebar">
            <div className="sb-sec">Clinical</div>
            <div className={`sb-it ${isActive("home")}`} onClick={() => navigate("/doctor/home")}><div className="ico">⚡</div> Command Centre</div>
            <div className={`sb-it ${isActive("patients")}`} onClick={() => navigate("/doctor/patients")}><div className="ico">👥</div> Patient Directory </div>
            <div className={`sb-it ${isActive("alerts")}`} onClick={() => navigate("/doctor/alerts")}> <div className="ico">🔔</div> Alerts </div>
            <div className={`sb-it ${isActive("reports")}`} onClick={() => navigate("/doctor/reports")}> <div className="ico">📋</div> Reports Queue </div>
            <div className={`sb-it ${isActive("analytics")}`} onClick={() => navigate("/doctor/analytics")}> <div className="ico">📊</div> Analytics </div>

            <div className="sb-sec">Workflow</div>
            <div className={`sb-it ${isActive("notes")}`} onClick={() => navigate("/doctor/notes")}> <div className="ico">📝</div> Clinical Notes </div>
            <div className={`sb-it ${isActive("followups")}`} onClick={() => navigate("/doctor/followups")}> <div className="ico">📅</div> Follow-ups </div>
            <div className="sb-sp"></div>

            <div className="sb-stat">
                <div className="sb-stat-row">
                    <span>Total Patients</span>
                    <span className="sb-stat-val">24</span>
                </div>

                <div className="sb-stat-row">
                    <span>High Risk</span>
                    <span className="sb-stat-val" style={{ color: "var(--rose)" }}>
                        8
                    </span>
                </div>

                <div className="sb-stat-row">
                    <span>Pending Reviews</span>
                    <span className="sb-stat-val" style={{ color: "var(--amber)" }}>
                        5
                    </span>
                </div>

                <div className="sb-stat-row">
                    <span>Tests Today</span>
                    <span className="sb-stat-val" style={{ color: "var(--emerald)" }}>
                        3
                    </span>
                </div>
            </div>
            <div className={`sb-it ${isActive("settings")}`} onClick={() => navigate("/doctor/settings")}> <div className="ico">⚙️</div> Settings </div>
            
            <div className="sb-it" onClick={() => { localStorage.clear(); window.location.href = '/'; }}> <div className="ico">🚪</div> Log Out </div>
        </aside>
    );
};

export default Sidebar;