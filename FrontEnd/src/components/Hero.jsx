import React from 'react';

function Hero({ setPage }) {
    return (
        <div className="hero-section" id='hero'>
            <div className="hero-content">
                <div className="hero-badge">
                    🏥 Trusted by 50+ Neurology Centers Across India
                </div>

                <h1 className="hero-title">
                    AI-Powered Early<br />
                    <em>Dementia Detection</em>
                </h1>

                <p className="hero-sub">
                    A 10-minute multi-modal screening — voice, drawing, memory & behaviour —
                    in 10+ Indian languages. Early detection changes everything.
                </p>

                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => setPage('test')}
                    >
                        🧠 Start Free Screening
                    </button>

                    <button
                        className="btn btn-secondary btn-lg"
                        onClick={() => setPage('dashboard')}
                    >
                        📊 View Demo Dashboard
                    </button>
                </div>

                <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    No app download needed · Free for caregivers · HIPAA-safe
                </p>
            </div>
        </div>
    );
}

export default Hero;