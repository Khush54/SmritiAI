import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './Doctor.css'
Chart.register(...registerables);

function Analytics(){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const barChartRef = useRef(null);
    const doughnutChartRef = useRef(null);
    const charts = useRef({ bar: null, doughnut: null });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                
                const mockDbData = {
                    kpis: [
                        { l: 'Avg. Score', v: '61.4', sub: 'Across 24 patients', c: 'var(--cyan)' },
                        { l: 'Avg. Age', v: '70.8y', sub: 'Patient cohort', c: 'var(--violet)' },
                        { l: 'Dropout Rate', v: '4.2%', sub: 'Last 6 months', c: 'var(--emerald)' },
                        { l: 'Progression', v: '↑32%', sub: 'High risk this yr', c: 'var(--rose)' },
                    ],
                    metrics: [
                        { domain: 'Memory Recall', pct: 62, c: '#F43F5E', desc: 'Most commonly impaired domain' },
                        { domain: 'Attention Span', pct: 54, c: '#F43F5E', desc: 'Correlates with progression' },
                        { domain: 'Orientation', pct: 48, c: '#F59E0B', desc: 'Watch for worsening' },
                        { domain: 'Language Fluency', pct: 38, c: '#F59E0B', desc: 'Often preserved until late stages' },
                        { domain: 'Drawing/Spatial', pct: 29, c: '#10B981', desc: 'Preserved in early stages' },
                    ],
                    cohortTrend: {
                        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        high: [5, 8, 10, 12, 15],
                        med: [10, 12, 11, 10, 8],
                        low: [9, 4, 3, 2, 1]
                    }
                };
                setData(mockDbData);
            } catch (err) {
                console.error("Analytics fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    useEffect(() => {
        if (!data || !barChartRef.current || !doughnutChartRef.current) return;

        if (charts.current.bar) charts.current.bar.destroy();
        if (charts.current.doughnut) charts.current.doughnut.destroy();

        charts.current.bar = new Chart(barChartRef.current.getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.cohortTrend.labels,
                datasets: [
                    { label: 'High', data: data.cohortTrend.high, backgroundColor: '#F43F5E' },
                    { label: 'Medium', data: data.cohortTrend.med, backgroundColor: '#F59E0B' },
                    { label: 'Low', data: data.cohortTrend.low, backgroundColor: '#10B981' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { stacked: true, grid: { display: false }, ticks: { color: '#94a3b8' } },
                    y: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                }
            }
        });

        charts.current.doughnut = new Chart(doughnutChartRef.current.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['High', 'Medium', 'Low'],
                datasets: [{
                    data: [33, 42, 25],
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

    }, [data]);

    if (loading) return <div className="page">Loading Intelligence...</div>;

    return (
        <div className="page">
            <div className="ph">
                <div className="ph-row">
                    <div>
                        <h1 style={{fontSize: '24px', fontWeight: '700'}}>Analytics</h1>
                        <p style={{color: 'var(--b3)', fontSize: '11px', letterSpacing: '0.5px'}}>COHORT INTELLIGENCE · AIIMS DELHI DEMENTIA PROGRAMME</p>
                    </div>
                    <div className="ph-act">
                        <button className="btn btn-g btn-sm" onClick={() => window.print()}>Export PDF</button>
                        <button className="btn btn-c btn-sm" onClick={() => alert("Refreshing Data...")}>Refresh Sync</button>
                    </div>
                </div>
            </div>

            <div className="g4" style={{ marginBottom: '16px' }}>
                {data.kpis.map((k, i) => (
                    <div key={i} className="card kpi">
                        <div className="kpi-val" style={{ color: k.c, fontSize: '26px' }}>{k.v}</div>
                        <div className="kpi-label">{k.l}</div>
                        <div className="kpi-sub">{k.sub}</div>
                    </div>
                ))}
            </div>

            <div className="g2" style={{ marginBottom: '16px' }}>
                <div className="card">
                    <div className="sh">
                        <div className="sh-title">Risk Cohort Trend</div>
                        <div className="sh-sub">AUG–DEC 2024</div>
                    </div>
                    <div style={{ height: '210px' }}><canvas ref={barChartRef}></canvas></div>
                </div>
                <div className="card">
                    <div className="sh">
                        <div className="sh-title">Score Distribution</div>
                        <div className="sh-sub">ALL PATIENTS</div>
                    </div>
                    <div style={{ height: '210px' }}><canvas ref={doughnutChartRef}></canvas></div>
                </div>
            </div>

            <div className="card">
                <div className="sh"><div className="sh-title">Risk Breakdown by Metric</div></div>
                {data.metrics.map((d, i) => (
                    <div key={i} style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ fontSize: '12.5px', color: 'var(--b2)' }}>{d.domain}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '11px', color: 'var(--b3)' }} className="hide-mobile">{d.desc}</span>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: '500', color: d.c }}>{d.pct}% impaired</span>
                            </div>
                        </div>
                        <div className="prog-t" style={{ height: '7px' }}>
                            <div className="prog-f" style={{ width: `${d.pct}%`, background: d.c, transition: 'width 1s ease-in-out' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Analytics;