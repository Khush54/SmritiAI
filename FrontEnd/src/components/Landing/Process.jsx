import React from 'react'

function Process() {
    const steps = [
        { n: '01', title: 'Take the Test', desc: 'Complete our 4-part, 10-minute cognitive screening in Hindi, Tamil, or 8 other Indian languages.', color: 'var(--blue)' },
        { n: '02', title: 'AI Analysis', desc: 'Our model cross-references your responses with validated clinical scales (MMSE, MoCA) and population data.', color: 'var(--teal)' },
        { n: '03', title: 'Get Your Report', desc: 'Receive a clear, colour-coded risk report with specific recommendations and doctor referral if needed.', color: 'var(--green)' },
    ];
    return (
        <div className="section" id='process'>
            <div className="section-label">Process</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '36px' }}>Three Steps to Clarity</h2>
            <div className="grid-3">
                {steps.map((s, index) => (
                    <div className="card" style={{ position: 'relative', overflow: 'hidden' }} key={index}>
                        <div style={{ fontSize: '52px', fontWeight: '700', color: s.color, opacity: '.12', position: 'absolute', top: '-8px', right: '12px', fontFamily: 'var(--font-serif)', lineHeight: '1' }}>{s.n}</div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: s.color, marginBottom: '10px', letterSpacing: '.04em' }}>{s.n}</div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{s.title}</h3>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Process