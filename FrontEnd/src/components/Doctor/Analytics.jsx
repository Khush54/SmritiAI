import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './Doctor.css';
Chart.register(...registerables);

const EMPTY_PATIENTS = [];
const titleCase = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

function Analytics({ dashboard, loading, error }) {
    const analytics = dashboard?.analytics;
    const patients = dashboard?.patients || EMPTY_PATIENTS;
    const barChartRef = useRef(null);
    const doughnutChartRef = useRef(null);
    const charts = useRef({ bar: null, doughnut: null });

    useEffect(() => {
        if (!analytics || !barChartRef.current || !doughnutChartRef.current) return;
        if (charts.current.bar) charts.current.bar.destroy();
        if (charts.current.doughnut) charts.current.doughnut.destroy();

        const riskDistribution = analytics.riskDistribution || {};
        charts.current.bar = new Chart(barChartRef.current.getContext('2d'), {
            type: 'bar',
            data: {
                labels: patients.map(p => p.name),
                datasets: [{
                    label: 'Cognitive Score',
                    data: patients.map(p => p.score || 0),
                    backgroundColor: patients.map(p => p.risk === 'High' ? '#F43F5E' : p.risk === 'Moderate' ? '#F59E0B' : '#10B981')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                    y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                }
            }
        });

        charts.current.doughnut = new Chart(doughnutChartRef.current.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['High', 'Moderate', 'Low'],
                datasets: [{
                    data: [riskDistribution.High || 0, riskDistribution.Moderate || 0, riskDistribution.Low || 0],
                    backgroundColor: ['#F43F5E', '#F59E0B', '#10B981'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12, padding: 20 } } },
                cutout: '75%'
            }
        });
    }, [analytics, patients]);

    if (loading) return <div className="page">Loading cohort intelligence...</div>;
    if (error) return <div className="page"><div className="card">{error}</div></div>;

    const kpis = [
        { l: 'Avg. Score', v: analytics?.kpis?.averageScore || 0, sub: `Across ${patients.length} assigned patients`, c: 'var(--cyan)' },
        { l: 'Avg. Age', v: `${analytics?.kpis?.averageAge || 0}y`, sub: 'Assigned cohort', c: 'var(--violet)' },
        { l: 'High Risk', v: analytics?.kpis?.highRisk || 0, sub: 'Needs priority review', c: 'var(--rose)' },
        { l: 'Reports', v: analytics?.kpis?.pendingReports || 0, sub: 'Assessment records', c: 'var(--emerald)' }
    ];

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1>Analytics</h1>
                        <p>ASSIGNED COHORT INTELLIGENCE</p>
                    </div>
                    <div className="ph-act">
                        <button className="btn btn-g btn-sm" onClick={() => window.print()}>Export PDF</button>
                    </div>
                </div>
            </div>

            <div className="g4" style={{ marginBottom: '16px' }}>
                {kpis.map((k) => (
                    <div key={k.l} className="card kpi">
                        <div className="kpi-val" style={{ color: k.c, fontSize: '26px' }}>{k.v}</div>
                        <div className="kpi-label">{k.l}</div>
                        <div className="kpi-sub">{k.sub}</div>
                    </div>
                ))}
            </div>

            <div className="g2" style={{ marginBottom: '16px' }}>
                <div className="card">
                    <div className="sh">
                        <div className="sh-title">Patient Score Distribution</div>
                        <div className="sh-sub">LIVE ASSIGNMENTS</div>
                    </div>
                    <div style={{ height: '210px' }}><canvas ref={barChartRef}></canvas></div>
                </div>
                <div className="card">
                    <div className="sh">
                        <div className="sh-title">Risk Distribution</div>
                        <div className="sh-sub">ASSIGNED PATIENTS</div>
                    </div>
                    <div style={{ height: '210px' }}><canvas ref={doughnutChartRef}></canvas></div>
                </div>
            </div>

            <div className="card">
                <div className="sh">
                    <div>
                        <div className="sh-title">Average Domain Performance</div>
                        <div className="sh-sub">FROM ASSIGNED PATIENT ASSESSMENTS</div>
                    </div>
                </div>

                {(analytics?.domainAverages || []).some(domain => domain.pct > 0) ? (
                    (analytics?.domainAverages || []).map((domain) => {
                        const performance = Math.max(0, Math.min(100, domain.pct || 0));
                        const impaired = 100 - performance;
                        const color = performance < 50 ? '#F43F5E' : performance < 75 ? '#F59E0B' : '#10B981';

                        return (
                            <div key={domain.domain} style={{ marginBottom: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <span style={{ fontSize: '12.5px', color: 'var(--b2)' }}>{titleCase(domain.domain)}</span>
                                    <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: '500', color }}>
                                        {performance}% avg - {impaired}% impaired
                                    </span>
                                </div>
                                <div className="prog-t" style={{ height: '7px' }}>
                                    <div className="prog-f" style={{ width: `${performance}%`, background: color }}></div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '28px', color: 'var(--b3)' }}>
                        Domain averages will appear after assigned patients complete assessments.
                    </div>
                )}
            </div>

        </div>
    );
}

export default Analytics;
