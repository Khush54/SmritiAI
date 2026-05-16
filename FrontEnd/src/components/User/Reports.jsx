import React, { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf'; 
import { Radar } from 'react-chartjs-2';
import { getPatientAssessments } from '../../services/assessmentService';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import './User.css'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function Reports({ patient }) {
    const chartRef = useRef(null);
    const [latestTest, setLatestTest] = useState(null);
    const [dynamicBreakdown, setDynamicBreakdown] = useState([]);
    const [dynamicStats, setDynamicStats] = useState([0,0,0,0,0,0]);
    const [debugError, setDebugError] = useState("");

    useEffect(() => {
        const loadTest = async () => {
            if (patient) {
                try {
                    const pId = patient.id || patient._id;
                    const res = await getPatientAssessments(pId);
                    if (res.success && res.data.length > 0) {
                        const latest = res.data[0];
                        setLatestTest(latest);

                        // Generate Dynamic Metrics based on latest score & answers
                        let memScore = latest.score;
                        if (latest.details?.memoryAns && latest.details.memoryAns !== "30 Oct") {
                            memScore = Math.max(30, memScore - 40);
                        }
                        
                        let behScore = latest.score;
                        let attScore = latest.score;
                        if (latest.details?.beh1 === "Often") {
                            behScore = Math.max(20, behScore - 50);
                            attScore = Math.max(30, attScore - 30);
                        } else if (latest.details?.beh1 === "Slight") {
                            behScore = Math.max(50, behScore - 20);
                        }

                        const breakdown = [
                            { title: 'Memory Recall', score: memScore },
                            { title: 'Language & Speech', score: Math.min(100, latest.score + 5) },
                            { title: 'Attention & Focus', score: attScore },
                            { title: 'Spatial Recognition', score: latest.score },
                            { title: 'Logic & Reasoning', score: latest.score },
                            { title: 'Behavioral Stability', score: behScore }
                        ];
                        setDynamicBreakdown(breakdown);
                        
                        const stats = [memScore, Math.min(100, latest.score + 5), attScore, latest.score, latest.score, behScore];
                        setDynamicStats(stats);
                    } else {
                        setLatestTest(null);
                        setDynamicBreakdown([]);
                        setDynamicStats([0,0,0,0,0,0]);
                        setDebugError("API Success, but no data found for patient " + pId);
                    }
                } catch(e) {
                    console.error("Failed to load assessments", e);
                    setDebugError(e.message);
                }
            }
        };
        loadTest();
    }, [patient]);

    if (!patient) {
        return (
            <div className="page" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <div style={{ fontSize: '50px', marginBottom: '20px' }}>📂</div>
                <h2 style={{ color: 'var(--c1)' }}>No Patient Selected</h2>
                <p style={{ color: 'var(--c4)' }}>Please select a family member from the Dashboard to view their analysis.</p>
            </div>
        );
    }

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        doc.setFontSize(22);
        doc.setTextColor(59, 130, 246); // Blue color
        doc.text("Smriti AI - Cognitive Report", 20, 20);
        
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 25, 190, 25);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Patient Name: ${patient.name}`, 20, 40);
        doc.text(`Patient ID: ${patient.id}`, 20, 48);
        doc.text(`Overall Score: ${patient.score}/100`, 20, 56);
        doc.text(`Risk Category: ${patient.risk}`, 20, 64);
        doc.text(`Report Generated: ${timestamp}`, 20, 72);

        doc.setFontSize(14);
        doc.text("Detailed Breakdown:", 20, 90);
        doc.setFontSize(11);
        
        dynamicBreakdown.forEach((item, index) => {
            doc.text(`• ${item.title}: ${item.score}%`, 25, 100 + (index * 8));
        });

        if (chartRef.current) {
            const chartImage = chartRef.current.toBase64Image();
            doc.addImage(chartImage, 'PNG', 30, 140, 150, 100);
        }

        doc.save(`${patient.name}_Report_${patient.id}.pdf`);
    };

    const handleShare = async () => {
        const shareText = `Cognitive Report for ${patient.name}:\nScore: ${patient.score}/100\nRisk: ${patient.risk}\nAnalyzed by Smriti AI.`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Report - ${patient.name}`,
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            alert("Sharing not supported on this browser. Copying to clipboard...");
            navigator.clipboard.writeText(shareText);
        }
    };

    const chartData = {
        labels: ['Memory', 'Language', 'Attention', 'Spatial', 'Logic', 'Behavior'],
        datasets: [{
            label: 'Current Performance',
            data: dynamicStats,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
        }]
    };

    const riskColor = patient.risk === 'High' ? 'var(--rose)' : patient.risk === 'Medium' ? 'var(--warm)' : 'var(--sage)';

    return (
        <div className="page" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--c1)' }}>Clinical Reports</h1>
                    <p style={{ color: 'var(--c4)', fontSize: '14px' }}>Deep-dive analysis of {patient.name}'s cognitive data.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-s btn-sm" onClick={handleDownloadPDF}>Download PDF</button>
                    <button className="btn btn-p btn-sm" onClick={handleShare}>Share with Doctor</button>
                </div>
            </div>

            <div style={{ 
                background: `linear-gradient(135deg, ${riskColor}, var(--c1))`,
                padding: '30px', borderRadius: 'var(--r16)', color: 'white', marginBottom: '25px',
                boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)'
            }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', opacity: 0.8 }}>Current Risk Status</span>
                <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '5px 0' }}>{patient.risk} Risk</h2>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>Overall Cognitive Score: {patient.score} / 100</div>
            </div>

            {debugError && (
                <div style={{ background: 'var(--rose)', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
                    Debug Error: {debugError}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                
                <div className="card" style={{ padding: '25px', borderRadius: 'var(--r16)', background: 'var(--surface)' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Cognitive Skill Map</h3>
                    <div style={{ height: '320px' }}>
                        <Radar ref={chartRef} data={chartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="card" style={{ padding: '25px', borderRadius: 'var(--r16)', background: 'var(--surface)' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Metric Breakdown</h3>
                    {dynamicBreakdown.length > 0 ? dynamicBreakdown.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--c3)' }}>{item.title}</span>
                                <span style={{ fontWeight: '700' }}>{item.score}%</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--c8)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ 
                                    width: `${item.score}%`, height: '100%', 
                                    background: riskColor, borderRadius: '10px', transition: 'width 1.5s ease' 
                                }} />
                            </div>
                        </div>
                    )) : (
                        <p style={{ color: 'var(--c4)', fontSize: '13px' }}>No test data available to generate metrics.</p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Reports;