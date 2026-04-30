import React, { useState } from 'react';

function Auth({ setPage }) {
  const [authTab, setAuthTab] = useState('login');
  const [selectedRole, setSelectedRole] = useState('patient');

  const isLogin = authTab === 'login';

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="brain-icon">🧠</div>
          Smriti AI
        </div>

        <div style={{ display: 'flex', gap: '4px', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '24px' }}>
          {['login', 'signup'].map((t) => (
            <button
              key={t}
              className="btn"
              style={{
                flex: 1,
                padding: '7px',
                textAlign: 'center',
                fontSize: '13px',
                background: authTab === t ? 'var(--surface)' : 'transparent',
                boxShadow: authTab === t ? 'var(--shadow-sm)' : 'none',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => setAuthTab(t)}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {!isLogin && (
          <div style={{ marginBottom: '20px' }}>
            <div className="role-grid">
              {[
                { r: 'patient', i: '👴', n: 'Patient' },
                { r: 'caregiver', i: '👪', n: 'Caregiver' },
                { r: 'doctor', i: '👩‍⚕️', n: 'Doctor' }
              ].map((role) => (
                <div
                  key={role.r}
                  className={`role-card ${selectedRole === role.r ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(role.r)}
                >
                  <div className="role-icon">{role.i}</div>
                  <div className="role-name">{role.n}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder={isLogin ? 'Enter Full Name' : 'Khushpreet Kaur'} />
            </div>
        )}

        <div className="form-group">
          <label className="form-label">Phone / Email</label>
          <input
            type="text"
            className="form-input"
            placeholder={isLogin ? 'Enter phone or email' : 'khush@example.com'}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-input" placeholder="••••••••" />
        </div>

        {isLogin && (
          <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--blue)', marginBottom: '16px', cursor: 'pointer' }}>
            Forgot Password?
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '14px', marginBottom: '14px' }}
          onClick={() => setPage('dashboard')}
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>

        <div className="divider-text">or continue with</div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {['📱 Google', '🔵 Facebook'].map((s) => (
            <button key={s} className="btn btn-secondary" style={{ flex: 1, padding: '9px', fontSize: '13px' }}>
              {s}
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px' }}>
          {isLogin ? (
            <>
              New to Smriti AI?{' '}
              <span style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={() => setAuthTab('signup')}>
                Create account
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={() => setAuthTab('login')}>
                Sign in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Auth;