import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Doctor.css'

const isToday = (date) => {
    if (!date) return false;
    return new Date(date).toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA');
};

const Sidebar = ({ isOpen, onClose, dashboard, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname.includes(path) ? "on" : "";
    const patients = dashboard?.patients || [];
    const stats = dashboard?.analytics?.kpis || {};
    const testsToday = patients.filter(patient => isToday(patient.lastTestDate || patient.lastTest)).length;

    const navItem = (path, icon, label) => (
        <div className={`sb-it ${isActive(path)}`} onClick={() => { navigate(`/doctor/${path}`); onClose && onClose(); }}>
            <div className="ico">{icon}</div> {label}
        </div>
    );

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sb-sec">Clinical</div>
            {navItem("home", "⚡", "Command Centre")}
            {navItem("patients", "👥", "Patient Directory")}
            {navItem("alerts", "🔔", "Alerts")}
            {navItem("reports", "📋", "Reports Queue")}
            {navItem("analytics", "📊", "Analytics")}

            <div className="sb-sec">Workflow</div>
            {navItem("notes", "📝", "Clinical Notes")}
            {navItem("followups", "📅", "Follow-ups")}
            
            <div className="sb-sp"></div>

            <div className="sb-stat">
                <div className="sb-stat-row">
                    <span>Total Patients</span>
                    <span className="sb-stat-val">{loading ? "--" : stats.totalPatients || patients.length}</span>
                </div>

                <div className="sb-stat-row">
                    <span>High Risk</span>
                    <span className="sb-stat-val" style={{ color: "var(--rose)" }}>
                        {loading ? "--" : stats.highRisk || 0}
                    </span>
                </div>

                <div className="sb-stat-row">
                    <span>Pending Reviews</span>
                    <span className="sb-stat-val" style={{ color: "var(--amber)" }}>
                        {loading ? "--" : stats.pendingReports || dashboard?.reports?.length || 0}
                    </span>
                </div>

                <div className="sb-stat-row">
                    <span>Tests Today</span>
                    <span className="sb-stat-val" style={{ color: "var(--emerald)" }}>
                        {loading ? "--" : testsToday}
                    </span>
                </div>
            </div>
            
            {navItem("settings", "⚙️", "Settings")}
            
            <div className="sb-it" onClick={() => { localStorage.clear(); window.location.href = '/'; onClose && onClose(); }}> 
                <div className="ico">🚪</div> Log Out 
            </div>
        </aside>
    );
};

export default Sidebar;
