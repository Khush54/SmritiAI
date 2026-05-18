import React, { useState, useContext } from 'react';
import { submitFeedback } from '../../Services/feedbackService';
import { AppContext } from '../../context/AppContext';
import './User.css';

function FeedbackPortal() {
  const { showAlert } = useContext(AppContext);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({ displayName: '', role: 'User', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const roles = ['User', 'Doctor', 'Other'];

  const handleSubmit = async () => {
    if (!rating) { showAlert('Please select a star rating.', 'error'); return; }
    if (!form.message.trim()) { showAlert('Please write a short message.', 'error'); return; }
    try {
      setLoading(true);
      const res = await submitFeedback({
        displayName: form.displayName.trim() || 'Anonymous',
        role: form.role,
        rating,
        message: form.message.trim(),
      });
      if (res.success) {
        setSubmitted(true);
        showAlert('Thank you! Your feedback has been shared on our landing page.', 'success');
      }
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to submit feedback. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🙏</div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px', color: 'var(--c1)' }}>Thank You!</h2>
        <p style={{ color: 'var(--c3)', lineHeight: '1.7', marginBottom: '30px' }}>
          Your feedback is now live on our landing page and helps other families discover Smriti AI.
        </p>
        <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginBottom: '30px' }}>
          {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: '28px', color: i <= rating ? '#f59e0b' : '#d1d5db' }}>★</span>)}
        </div>
        <button className="btn btn-s btn-sm" onClick={() => { setSubmitted(false); setRating(0); setForm({ displayName: '', role: 'User', message: '' }); }}>
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Share Your Feedback 💬</h1>
            <p>Your experience helps other families discover and trust Smriti AI.</p>
          </div>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, var(--blue-light), rgba(13,148,136,0.08))',
        border: '1px solid rgba(37,99,235,0.2)',
        borderRadius: 'var(--r16)',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start'
      }}>
        <span style={{ fontSize: '22px' }}>📢</span>
        <div>
          <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--blue)', marginBottom: '4px' }}>Your feedback goes public!</div>
          <p style={{ fontSize: '13px', color: 'var(--c3)', margin: 0, lineHeight: '1.6' }}>
            Approved responses appear in the <strong>Testimonials</strong> section on our landing page. You can choose to remain anonymous.
          </p>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c3)', display: 'block', marginBottom: '12px' }}>
            OVERALL RATING <span style={{ color: 'var(--rose)' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[1,2,3,4,5].map(i => (
              <button
                key={i}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(0)}
                style={{
                  fontSize: '36px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: i <= (hovered || rating) ? '#f59e0b' : '#d1d5db',
                  transition: 'transform 0.1s, color 0.1s',
                  transform: i <= (hovered || rating) ? 'scale(1.15)' : 'scale(1)',
                  padding: '4px'
                }}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--blue)', fontWeight: '500' }}>
              {['', 'Poor 😞', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent 🤩'][rating]}
            </div>
          )}
        </div>

        <div className="settings-grid" style={{ marginBottom: '20px' }}>
          <div className="field">
            <label className="flabel">Your Name <span style={{ color: 'var(--c4)', fontWeight: 400 }}>(optional)</span></label>
            <input
              className="finput"
              placeholder="e.g. Riya Sharma"
              value={form.displayName}
              onChange={e => setForm({ ...form, displayName: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="flabel">Your Role</label>
            <select className="finput" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="field" style={{ marginBottom: '24px' }}>
          <label className="flabel">Your Experience <span style={{ color: 'var(--rose)' }}>*</span></label>
          <textarea
            className="finput"
            rows="5"
            placeholder="Tell us how Smriti AI has helped you or your family member. What features do you love? What would you improve?"
            style={{ resize: 'vertical' }}
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
          />
          <div style={{ fontSize: '11px', color: 'var(--c4)', marginTop: '4px', textAlign: 'right' }}>
            {form.message.length} characters
          </div>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--c4)', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <span>🔒</span>
          <span>Leaving Name blank submits as "Anonymous". We never share your email or personal data. Feedback may be reviewed before going live.</span>
        </div>

        <button className="btn btn-p" onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px' }}>
          {loading ? 'Submitting...' : '🚀 Submit Feedback'}
        </button>
      </div>
    </div>
  );
}

export default FeedbackPortal;
