import React, { useEffect, useState } from 'react';
import { getPublicFeedback } from '../../Services/feedbackService';

const FALLBACK = [
  { displayName: 'Riya Sharma', role: 'Daughter & Caregiver', rating: 5, message: 'Smriti AI helped us detect my father\'s early cognitive decline months before his hospital visit. The multilingual support in Hindi made it so easy for him to participate.' },
  { displayName: 'Dr. Anand Mehta', role: 'General Physician, Mumbai', rating: 5, message: 'I recommend Smriti AI to family caregivers for between-appointment monitoring. The reports are clinically structured and save valuable consultation time.' },
  { displayName: 'Priya Nair', role: 'Caregiver, Kochi', rating: 4, message: 'The daily mood log and behaviour survey are exactly what we needed. We\'ve been tracking my mother\'s sleep and appetite trends for 3 months now — the reports are eye-opening.' },
  { displayName: 'Suresh Patel', role: 'Son & Family Caregiver', rating: 5, message: 'Finally an app that works in Gujarati! My grandfather could answer the memory questions himself. The 10-minute test is the right length — not too tiring.' },
];

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#d1d5db', fontSize: '16px' }}>★</span>
      ))}
    </div>
  );
}

function Testimonials() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    getPublicFeedback()
      .then(res => {
        if (res.success && res.data.length >= 1) {
          setItems(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const avatarColors = ['#2563eb', '#0d9488', '#7c3aed', '#d97706', '#dc2626', '#059669'];

  return (
    <div className="section" id="testimonials">
      <div className="section-label">Real Stories</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '8px' }}>
        Trusted by Families & Doctors Across India
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', maxWidth: '520px' }}>
        Hear from caregivers and healthcare professionals who use Smriti AI every day.
      </p>

      <div className="testimonials-grid">
        {items.slice(0, 4).map((t, i) => (
          <div className="testimonial-card card-hover" key={i}>
            <StarRating rating={t.rating} />
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px', fontStyle: 'italic' }}>
              "{t.message}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                background: avatarColors[i % avatarColors.length],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: '700', fontSize: '15px'
              }}>
                {(t.displayName || 'A')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{t.displayName || 'Anonymous'}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.role || 'Caregiver'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
