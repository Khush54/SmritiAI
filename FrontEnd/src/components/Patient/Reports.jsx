import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function Reports() {
   
    return (
        <div className="reports-container" style={{ 
            padding: '20px', 
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg)',
            minHeight: '100vh',
            fontFamily: 'var(--font-sans)'
        }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', margin: 0, color: 'var(--text-primary)', fontWeight: '700' }}>My Reports</h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                        AI-generated cognitive health analysis · Smriti AI v2.1
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn" style={{ 
                        padding: '8px 16px', borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--border)', background: 'var(--surface)',
                        color: 'var(--text-primary)', cursor: 'pointer'
                    }}>Download PDF</button>
                    <button className="btn" style={{ 
                        padding: '8px 16px', borderRadius: 'var(--radius-md)', 
                        background: 'var(--blue)', color: '#fff', border: 'none', cursor: 'pointer'
                    }}>Share with Doctor</button>
                </div>
            </div>

            {/* Overall Risk Banner - High contrast gradient */}
            <div style={{
                background: 'linear-gradient(135deg, var(--red), #9B1C1C)',
                borderRadius: 'var(--radius-xl)', padding: '24px', color: '#fff', marginBottom: '24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: 'var(--shadow-md)'
            }}>
                <div>
                    <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Risk Assessment</span>
                    <h2 style={{ fontSize: '32px', margin: '4px 0', fontWeight: '700' }}>High Risk</h2>
                    <p style={{ opacity: 0.9, fontSize: '14px' }}>Score: 47/100 · Immediate clinical evaluation recommended</p>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>LATEST TEST</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>28 Oct 2024</div>
                </div>
            </div>

            <div className="grid-2" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr', 
                marginBottom: '24px' 
            }}>

                {/* Cognitive Breakdown Card */}
                <div className="card" style={{ 
                    background: 'var(--surface)', 
                    padding: '20px', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '15px', color: 'var(--text-primary)' }}>Cognitive Breakdown</h3>
                    {[
                        { title: 'Memory Recall', score: 38, color: 'var(--red)', status: 'Severe' },
                        { title: 'Language Fluency', score: 52, color: 'var(--amber)', status: 'Moderate' },
                        { title: 'Attention Span', score: 35, color: 'var(--red)', status: 'Severe' },
                        { title: 'Drawing (Spatial)', score: 58, color: 'var(--amber)', status: 'Mild' }
                    ].map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{item.title}</span>
                                <span style={{ color: item.color, fontWeight: 'bold' }}>{item.status} ({item.score}%)</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                <div style={{ 
                                    width: `${item.score}%`, 
                                    height: '100%', 
                                    background: item.color, 
                                    borderRadius: 'var(--radius-sm)',
                                    transition: 'width 1s ease-in-out'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;