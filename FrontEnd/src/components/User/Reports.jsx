import React, { useRef, useEffect, useState, useContext } from 'react';
import { jsPDF } from 'jspdf'; 
import { Radar } from 'react-chartjs-2';
import { getPatientAssessments } from '../../Services/assessmentService';
import { AppContext } from '../../context/AppContext';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import './User.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function Reports({ patient }) {
    const { showAlert } = useContext(AppContext);
    const chartRef = useRef(null);
    const [latestTest, setLatestTest] = useState(null);
    const [dynamicBreakdown, setDynamicBreakdown] = useState([]);
    const [dynamicStats, setDynamicStats] = useState([0,0,0,0,0,0]);
    const [clinicalSummary, setClinicalSummary] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTest = async () => {
            if (!patient) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const pId = patient.id || patient._id;
                
                if (!pId) {
                    setLoading(false);
                    return;
                }

                const res = await getPatientAssessments(pId);
                
                if (res && res.success && res.data && res.data.length > 0) {
                    const latest = res.data[0];
                    setLatestTest(latest);

                    // Pull data straight out of the rich AI fusion engine logs
                    const aiReport = latest.details?.aiReport;
                    
                    if (aiReport) {
                        setClinicalSummary(aiReport.clinicalSummary || "No comprehensive summary logs compiled.");
                        setRecommendations(aiReport.recommendations || []);
                        
                        // Read numeric percentile data dynamically from AI engine logs
                        const b1 = typeof aiReport.breakdown?.memory === 'number' ? aiReport.breakdown.memory : latest.score || 50;
                        const b2 = typeof aiReport.breakdown?.language === 'number' ? aiReport.breakdown.language : latest.score || 50;
                        const b3 = typeof aiReport.breakdown?.spatial === 'number' ? aiReport.breakdown.spatial : latest.score || 50;
                        const b4 = typeof aiReport.breakdown?.attention === 'number' ? aiReport.breakdown.attention : latest.score || 50;
                        const b5 = typeof aiReport.breakdown?.logic === 'number' ? aiReport.breakdown.logic : latest.score || 50;
                        const b6 = typeof aiReport.breakdown?.behavior === 'number' ? aiReport.breakdown.behavior : latest.score || 50;

                        const breakdown = [
                            { title: 'Memory Recall / Orientation', score: b1 },
                            { title: 'Language & Speech Fluency', score: b2 },
                            { title: 'Attention & Focus Metrics', score: b4 },
                            { title: 'Spatial Grid Recognition', score: b3 },
                            { title: 'Logic & Executive Reasoning', score: b5 },
                            { title: 'Emotional & Behavioral Stability', score: b6 }
                        ];
                        setDynamicBreakdown(breakdown);
                        setDynamicStats([b1, b2, b4, b3, b5, b6]);
                    } else {
                        // Fallback logic for legacy structural models schema records
                        const fallbackBreakdown = [
                            { title: 'Memory Recall', score: latest.score || 0 },
                            { title: 'Language & Speech', score: latest.score || 0 },
                            { title: 'Attention & Focus', score: latest.score || 0 },
                            { title: 'Spatial Recognition', score: latest.score || 0 },
                            { title: 'Logic & Reasoning', score: latest.score || 0 },
                            { title: 'Behavioral Stability', score: latest.score || 0 }
                        ];
                        setDynamicBreakdown(fallbackBreakdown);
                        setDynamicStats(Array(6).fill(latest.score || 0));
                        setClinicalSummary("Legacy manual tracking telemetry without deep AI semantic mapping logs.");
                        setRecommendations([]);
                    }
                } else {
                    setLatestTest(null);
                    setDynamicBreakdown([]);
                    setDynamicStats([0,0,0,0,0,0]);
                    setClinicalSummary("");
                    setRecommendations([]);
                }
            } catch(e) {
                console.error("Failed to fetch assessment records stream", e);
                // Fail gracefully instead of showing aggressive alerts to user
                setLatestTest(null);
            } finally {
                setLoading(false);
            }
        };
        loadTest();
    }, [patient]);

    const handleDownloadPDF = () => {
        if (!latestTest) return;
        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        doc.setFontSize(22);
        doc.setTextColor(59, 130, 246); 
        doc.text("Smriti AI - Cognitive Evaluation Matrix", 20, 20);
        
        doc.setDrawColor(229, 231, 235);
        doc.line(20, 26, 190, 26);

        doc.setFontSize(11);
        doc.setTextColor(55, 65, 81);
        doc.text(`Patient Name: ${patient.name}`, 20, 38);
        doc.text(`Patient ID: ${patient.id || patient._id}`, 20, 46);
        doc.text(`Calculated Cognitive Baseline: ${patient.score || 'N/A'}%`, 20, 54);
        doc.text(`Risk Metric: ${patient.risk || 'Pending'} Level`, 20, 62);
        doc.text(`Report Datestamp: ${timestamp}`, 20, 70);

        doc.setFontSize(14);
        doc.setTextColor(17, 24, 39);
        doc.text("Neurological Skill Vectors Breakdown:", 20, 85);
        
        doc.setFontSize(11);
        doc.setTextColor(75, 85, 99);
        dynamicBreakdown.forEach((item, index) => {
            doc.text(`• ${item.title}: ${item.score}%`, 25, 95 + (index * 8));
        });

        // Safe insertion wrapper logic for chart graphic asset vectors 
        if (chartRef.current) {
            try {
                const chartImage = chartRef.current.toBase64Image();
                doc.addImage(chartImage, 'PNG', 35, 145, 140, 95);
            } catch (err) {
                console.error("Chart asset snapshot binding failed during pdf generation", err);
            }
        }

        doc.save(`${patient.name.replace(/\s+/g, '_')}_SmritiAI_Report.pdf`);
    };

    const handleShare = async () => {
        const shareText = `Cognitive Report Summary for ${patient.name}:\nBaseline Score: ${patient.score || 0}/100\nRisk Classification: ${patient.risk || 'Unknown'}\nProcessed via Smriti AI Linguistic Engine.`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Smriti AI Diagnostic Report - ${patient.name}`,
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Native device share pipeline rejected", err);
            }
        } else {
            navigator.clipboard.writeText(shareText);
            showAlert("Summary payload copied securely to local clipboard!", "success");
        }
    };

    // Dark-Mode Mutation Observers
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.getAttribute('data-dark') === 'true');
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.getAttribute('data-dark') === 'true');
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
    const labelColor = isDarkMode ? '#D1D5DB' : '#374151';

    const chartOptions = {
        maintainAspectRatio: false,
        scales: {
            r: {
                grid: { color: gridColor },
                angleLines: { color: gridColor, lineWidth: 1.2 },
                pointLabels: { 
                    color: labelColor, 
                    font: { size: 11, weight: '600', family: 'Inter, sans-serif' },
                    padding: 8
                },
                ticks: { display: false },
                suggestMin: 0,
                suggestMax: 100
            }
        },
        plugins: { legend: { display: false } }
    };

    const chartData = {
        labels: ['Memory', 'Language', 'Attention', 'Spatial', 'Logic', 'Behavior'],
        datasets: [{
            data: dynamicStats,
            backgroundColor: isDarkMode ? 'rgba(37, 99, 235, 0.25)' : 'rgba(37, 99, 235, 0.12)',
            borderColor: '#2563EB',
            borderWidth: 2,
            pointBackgroundColor: '#2563EB',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#2563EB'
        }]
    };

    const hasNoScore = patient.score === null || patient.score === undefined;
    const riskColor = patient.risk === 'High' ? '#EF4444' : (patient.risk === 'Moderate' || patient.risk === 'Medium') ? '#F59E0B' : '#10B981';

    if (loading) {
        return (
            <div className="page" style={{ textAlign: 'center', padding: '100px 0' }}>
                <div className="loader" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '20px', color: 'var(--c4)' }}>Retrieving complex clinical observation profiles...</p>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="page" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <h2 style={{ fontSize: '24px', color: 'var(--c1)', marginBottom: '8px', fontWeight: '600' }}>No Patient Selected</h2>
                <p style={{ color: 'var(--c3)', fontSize: '15px' }}>Please select a patient from the home dashboard to view their clinical reports.</p>
            </div>
        );
    }

    return (
        <div className="page" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Module Matrix */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--c1)', margin: 0 }}>Clinical Diagnostics Dashboard</h1>
                    <p style={{ color: 'var(--c4)', fontSize: '14px', marginTop: '4px' }}>Automated multimodal mapping matrix data for {patient.name}.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-s btn-sm" disabled={!latestTest} onClick={handleDownloadPDF} style={{ borderRadius: '10px' }}>Download PDF</button>
                    <button className="btn btn-p btn-sm" disabled={!latestTest} onClick={handleShare} style={{ borderRadius: '10px' }}>Share Profile</button>
                </div>
            </div>

            {/* Comprehensive Risk Status Banner */}
            <div className="risk-banner" style={{ 
                background: hasNoScore ? 'var(--c7)' : `linear-gradient(135deg, ${riskColor}, #111827)`,
                borderRadius: '24px', color: hasNoScore ? 'var(--c3)' : 'white', marginBottom: '30px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
            }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85, fontWeight: '600' }}>Baseline Risk Index Classification</span>
                <h2 style={{ fontSize: '38px', fontWeight: '800', margin: '8px 0 4px' }}>
                    {hasNoScore ? 'Awaiting System Diagnostic Init' : `${patient.risk} Clinical Risk`}
                </h2>
                <div style={{ fontSize: '16px', fontWeight: '500', opacity: 0.95 }}>
                    {hasNoScore ? 'No telemetry logs compiled. Please trigger an assessment loop first.' : `Comprehensive Multimodal Baseline: ${patient.score}%`}
                </div>
            </div>

            {/* Split Screen Render Engine Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '25px' }}>
                
                {/* Visual Radar Skill-Mapping Node */}
                <div className="card" style={{ padding: '25px', borderRadius: '20px', backgroundColor: 'var(--surface)', border: '1px solid var(--c8)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600', color: 'var(--c1)' }}>Cognitive Skill Topology Map</h3>
                    <div style={{ height: '320px', position: 'relative', width: '100%', margin: 'auto' }}>
                        {hasNoScore ? (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c4)', fontSize: '14px' }}>
                                Performance mapping trace will render post-screening sequence.
                            </div>
                        ) : (
                            <Radar ref={chartRef} data={chartData} options={chartOptions} />
                        )}
                    </div>
                </div>

                {/* Granular Progressive Percentile Metrics Block */}
                <div className="card" style={{ padding: '25px', borderRadius: '20px', backgroundColor: 'var(--surface)', border: '1px solid var(--c8)' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600', color: 'var(--c1)' }}>Diagnostic Metric Vector Sliders</h3>
                    {hasNoScore ? (
                        <div style={{ padding: '6px 0', color: 'var(--c4)', fontSize: '14px' }}>
                            No variable data streams initialized yet.
                        </div>
                    ) : dynamicBreakdown.length > 0 ? dynamicBreakdown.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--c3)', fontWeight: '500' }}>{item.title}</span>
                                <span style={{ fontWeight: '700', color: 'var(--c1)' }}>{item.score}%</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--c8)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ 
                                    width: `${item.score}%`, height: '100%', 
                                    background: riskColor, borderRadius: '10px', transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                                }} />
                            </div>
                        </div>
                    )) : (
                        <p style={{ color: 'var(--c4)', fontSize: '13px' }}>Error compiling dynamic baseline vectors stream.</p>
                    )}
                </div>
            </div>

            {/* AI Clinical Diagnostic Insights Summary Component Row */}
            {!hasNoScore && clinicalSummary && (
                <div className="card" style={{ marginTop: '25px', padding: '25px', borderRadius: '20px', backgroundColor: 'var(--surface)', border: '1px solid var(--c8)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#2563EB', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>✨</span> Smriti AI Clinical Synthesis Insight
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--c3)', margin: 0, fontWeight: '400', textAlign: 'justify' }}>
                        {clinicalSummary}
                    </p>

                    {recommendations && recommendations.length > 0 && (
                        <div style={{ marginTop: '24px', borderTop: '1px solid var(--c8)', paddingTop: '20px' }}>
                            <h4 style={{ fontSize: '15px', color: 'var(--c1)', marginBottom: '16px', fontWeight: '600' }}>AI Actionable Recommendations</h4>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {recommendations.map((rec, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'var(--bg)', padding: '12px 16px', borderRadius: '12px', borderLeft: `4px solid ${rec.color || '#3B82F6'}` }}>
                                        <div style={{ fontSize: '20px', lineHeight: 1 }}>{rec.icon || '📌'}</div>
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: '700', color: rec.color || 'var(--c3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                                                {rec.priority || 'Suggestion'}
                                            </div>
                                            <div style={{ fontSize: '14px', color: 'var(--c2)', lineHeight: '1.5' }}>
                                                {rec.text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Reports;