import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './Doctor.css'
Chart.register(...registerables);

function Reports(){
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeReport, setActiveReport] = useState(null); // The patient currently shown in Radar
    const radarRef = useRef(null);
    const chartInstance = useRef(null);

    // 1. Fetch Reports Queue
    useEffect(() => {
        const fetchReports = async () => {
            try {
                // Replace with your API: const res = await fetch('/api/reports');
                // Mocking data based on your requirements
                const mockData = [
                    { id: 1, name: "Ramesh Kumar", score: 45, lastTest: "12 May 2026", city: "Delhi", risk: "High", flag: true, notes: "Significant decline in short-term recall and spatial orientation.", domains: [40, 55, 30, 60, 45] },
                    { id: 2, name: "Sita Devi", score: 62, lastTest: "10 May 2026", city: "Mumbai", risk: "Medium", flag: false, notes: "Executive function stable, minor word-finding difficulties.", domains: [65, 70, 55, 50, 60] },
                    { id: 3, name: "Arjun Singh", score: 28, lastTest: "09 May 2026", city: "Bangalore", risk: "High", flag: true, notes: "Urgent: Patient struggling with basic orientation tasks.", domains: [20, 30, 25, 40, 35] }
                ];
                setReports(mockData);
                setActiveReport(mockData[0]); // Default to first patient
            } catch (err) {
                console.error("Error fetching reports:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    // 2. Initialize/Update Radar Chart
    useEffect(() => {
        if (!activeReport || !radarRef.current) return;

        const ctx = radarRef.current.getContext('2d');
        
        if (chartInstance.current) chartInstance.current.destroy();

        chartInstance.current = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Memory', 'Attention', 'Language', 'Visuospatial', 'Executive'],
                datasets: [{
                    label: activeReport.name,
                    data: activeReport.domains,
                    backgroundColor: 'rgba(34, 211, 238, 0.2)',
                    borderColor: 'rgba(34, 211, 238, 1)',
                    pointBackgroundColor: 'rgba(34, 211, 238, 1)',
                }, {
                    label: 'Baseline Range',
                    data: [60, 60, 60, 60, 60],
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderDash: [5, 5],
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        pointLabels: { color: '#94a3b8', font: { size: 10 } },
                        ticks: { display: false, stepSize: 20 },
                        suggestedMin: 0,
                        suggestedMax: 80
                    }
                },
                plugins: { legend: { display: false } },
                maintainAspectRatio: false
            }
        });

        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, [activeReport]);

    const scoreColor = (s) => s < 40 ? 'var(--rose)' : s < 65 ? 'var(--amber)' : 'var(--emerald)';

    if (loading) return <div className="page">Loading Queue...</div>;

    return (
        <div className="page">
            {/* Header Area */}
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1 style={{fontSize: '24px', fontWeight: '700'}}>Reports Queue</h1>
                        <p style={{color: 'var(--b3)', fontSize: '12px'}}>{reports.length} REPORTS PENDING REVIEW</p>
                    </div>
                </div>
            </div>

            {/* KPI Row */}
            <div className="g4" style={{ marginBottom: '16px' }}>
                <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--amber)' }}>{reports.length}</div><div className="kpi-label">Pending Review</div></div>
                <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--emerald)' }}>3</div><div className="kpi-label">Reviewed Today</div></div>
                <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--rose)' }}>{reports.filter(r => r.risk === 'High').length}</div><div className="kpi-label">Critical</div></div>
                <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--cyan)' }}>18</div><div className="kpi-label">Total Month</div></div>
            </div>

            {/* Main Content: Left List, Right Detail */}
            <div className="g2" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                
                {/* Left: Pending List */}
                <div className="card">
                    <div className="sh">
                        <div className="sh-title">Pending Reviews</div>
                        <div className="sh-sub">FLAGGED FOR CLINICAL ACTION</div>
                    </div>
                    
                    {reports.map(p => (
                        <div 
                            key={p.id} 
                            onClick={() => setActiveReport(p)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', 
                                borderRadius: '8px', background: activeReport?.id === p.id ? 'var(--navy-3)' : 'var(--navy-4)',
                                marginBottom: '8px', border: `1px solid ${p.flag ? 'rgba(244,63,94,.2)' : 'var(--border)'}`,
                                cursor: 'pointer', transition: '0.2s'
                            }}
                        >
                            <div className="nav-avi" style={{width:'36px', height:'36px'}}>{p.name[0]}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--b2)' }}>{p.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--b3)', fontFamily: 'var(--mono)' }}>
                                    Score: {p.score}/100 · {p.lastTest}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--b2)', marginTop: '4px', fontStyle: 'italic' }}>
                                    "{p.notes}"
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', alignItems: 'flex-end' }}>
                                <span className={`badge ${p.risk === 'High' ? 'br' : 'ba'}`}>{p.risk}</span>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button className="btn btn-g btn-sm" onClick={(e) => {e.stopPropagation(); alert("Approving report...")}}>Approve</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Domain Analysis Detail */}
                <div className="card" style={{height: 'fit-content', position: 'sticky', top: '20px'}}>
                    <div className="sh">
                        <div className="sh-title">Domain Analysis — {activeReport?.name}</div>
                        <button className="btn btn-c btn-sm" onClick={() => alert("Redirecting to full clinical record...")}>Full File</button>
                    </div>

                    <div style={{ height: '220px', marginBottom: '20px' }}>
                        <canvas ref={radarRef}></canvas>
                    </div>

                    <div>
                        {['Memory', 'Attention', 'Language', 'Visuospatial', 'Executive'].map((l, i) => (
                            <div key={l} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', fontFamily: 'var(--mono)' }}>
                                    <span style={{ color: 'var(--b3)' }}>{l.toUpperCase()}</span>
                                    <span style={{ color: scoreColor(activeReport.domains[i]), fontWeight: '600' }}>
                                        {activeReport.domains[i]} / 80
                                    </span>
                                </div>
                                <div className="prog-t">
                                    <div 
                                        className="prog-f" 
                                        style={{ 
                                            width: `${(activeReport.domains[i] / 80) * 100}%`, 
                                            background: scoreColor(activeReport.domains[i]) 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;