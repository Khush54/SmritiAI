import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import './Doctor.css';
Chart.register(...registerables);

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending';
const scoreColor = (score = 0) => score < 50 ? 'var(--rose)' : score < 75 ? 'var(--amber)' : 'var(--emerald)';

function Reports({ dashboard, loading, error }) {
    const reports = dashboard?.reports || [];
    const [activeReportId, setActiveReportId] = useState(null);
    const activeReport = reports.find(report => report.id === activeReportId) || reports[0] || null;
    const radarRef = useRef(null);
    const chartInstance = useRef(null);

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
                    pointBackgroundColor: 'rgba(34, 211, 238, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        pointLabels: { color: '#94a3b8', font: { size: 10 } },
                        ticks: { display: false },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: { legend: { display: false } },
                maintainAspectRatio: false
            }
        });

        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, [activeReport]);

    if (loading) return <div className="page">Loading reports queue...</div>;
    if (error) return <div className="page"><div className="card">{error}</div></div>;

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>Reports Queue</h1>
                        <p>{reports.length} ASSIGNED REPORTS READY FOR REVIEW</p>
                    </div>
                </div>
            </div>

            <div className="g4" style={{ marginBottom: '16px' }}>
                <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--amber)' }}>{reports.length}</div><div className="kpi-label">Pending Review</div></div>
                <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--rose)' }}>{reports.filter(r => r.risk === 'High').length}</div><div className="kpi-label">Critical</div></div>
                <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--cyan)' }}>{dashboard?.patients?.length || 0}</div><div className="kpi-label">Assigned</div></div>
                <div className="card kpi"><div className="kpi-val" style={{ color: 'var(--emerald)' }}>{dashboard?.analytics?.kpis?.averageScore || 0}</div><div className="kpi-label">Avg Score</div></div>
            </div>

            {reports.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--b3)' }}>No assessment reports for assigned patients yet.</div>
            ) : (
                <div className="g2" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                    <div className="card">
                        <div className="sh">
                            <div className="sh-title">Pending Reviews</div>
                            <div className="sh-sub">AI-FLAGGED FOR CLINICAL ACTION</div>
                        </div>
                        {reports.map(report => (
                            <div key={report.id} onClick={() => setActiveReportId(report.id)} style={{
                                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px',
                                borderRadius: '8px', background: activeReport?.id === report.id ? 'var(--navy-3)' : 'var(--navy-4)',
                                marginBottom: '8px', border: `1px solid ${report.flag ? 'rgba(244,63,94,.2)' : 'var(--border)'}`,
                                cursor: 'pointer'
                            }}>
                                <div className="nav-avi" style={{ width: '36px', height: '36px' }}>{report.name[0]}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--b2)' }}>{report.name}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--b3)', fontFamily: 'var(--mono)' }}>
                                        Score: {report.score}/100 - {formatDate(report.lastTest)}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--b2)', marginTop: '4px', fontStyle: 'italic' }}>{report.notes}</div>
                                </div>
                                <span className={`badge ${report.risk === 'High' ? 'br' : report.risk === 'Moderate' ? 'ba' : 'bg'}`}>{report.risk}</span>
                            </div>
                        ))}
                    </div>

                    {activeReport && (
                        <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '20px' }}>
                            <div className="sh"><div className="sh-title">Domain Analysis - {activeReport.name}</div></div>
                            <div style={{ height: '220px', marginBottom: '20px' }}><canvas ref={radarRef}></canvas></div>
                            {['Memory', 'Attention', 'Language', 'Visuospatial', 'Executive'].map((label, i) => (
                                <div key={label} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', fontFamily: 'var(--mono)' }}>
                                        <span style={{ color: 'var(--b3)' }}>{label.toUpperCase()}</span>
                                        <span style={{ color: scoreColor(activeReport.domains[i]), fontWeight: '600' }}>{activeReport.domains[i]} / 100</span>
                                    </div>
                                    <div className="prog-t"><div className="prog-f" style={{ width: `${activeReport.domains[i]}%`, background: scoreColor(activeReport.domains[i]) }}></div></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Reports;
