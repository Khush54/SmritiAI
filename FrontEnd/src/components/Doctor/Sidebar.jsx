import React from "react";
import './Doctor.css'
const Sidebar = ({ currentPage, setPage }) => {
    return (
        <aside className="sidebar">
            <div className="sb-sec">Clinical</div>
            <div className={`sb-it ${currentPage === "home" ? "on" : ""}`} onClick={() => setPage("home")}><div className="ico">⚡</div> Command Centre</div>
            <div className={`sb-it ${currentPage === "patients" ? "on" : ""}`} onClick={() => setPage("patients")}><div className="ico">👥</div> Patient Directory </div>
            <div className={`sb-it ${currentPage === "alerts" ? "on" : ""}`} onClick={() => setPage("alerts")}> <div className="ico">🔔</div> Alerts </div>
            <div className={`sb-it ${currentPage === "reports" ? "on" : ""}`} onClick={() => setPage("reports")}> <div className="ico">📋</div> Reports Queue </div>
            <div className={`sb-it ${currentPage === "analytics" ? "on" : ""}`} onClick={() => setPage("analytics")}> <div className="ico">📊</div> Analytics </div>

            <div className="sb-sec">Workflow</div>
            <div className={`sb-it ${currentPage === "notes" ? "on" : ""}`} onClick={() => setPage("notes")}> <div className="ico">📝</div> Clinical Notes </div>
            <div className={`sb-it ${currentPage === "followups" ? "on" : ""}`} onClick={() => setPage("followups")}> <div className="ico">📅</div> Follow-ups </div>
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
            <div className={`sb-it ${currentPage === "settings" ? "on" : ""}`} onClick={() => setPage("settings")}> <div className="ico">⚙️</div> Settings </div>
        </aside>
    );
};

export default Sidebar;