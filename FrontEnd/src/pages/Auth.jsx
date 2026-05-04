import React, { useState, useEffect } from 'react';

function Auth({ setPage }) {
  const [authTab, setAuthTab] = useState('login');
  const [selectedRole, setSelectedRole] = useState('patient');
  
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '', 
    password: ''
  });

  const [errors, setErrors] = useState({});
  const isLogin = authTab === 'login';

  const validate = () => {
    let newErrors = {};
    
    if (!isLogin) {
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Name is required";
      } else if (!nameRegex.test(formData.fullName)) {
        newErrors.fullName = "Only alphabets are allowed";
      } else if (formData.fullName.trim().length < 3) {
        newErrors.fullName = "Minimum 3 characters required";
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!formData.contact) {
      newErrors.contact = "Email or Phone is required";
    } else {
      const isEmail = emailRegex.test(formData.contact);
      const isPhone = phoneRegex.test(formData.contact);
      if (!isEmail && !isPhone) {
        newErrors.contact = "Enter a valid email or 10-digit phone number";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validate();
  }, [formData, authTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.keys(errors).length === 0;

  const errorStyle = { 
    color: '#ff4d4d', 
    fontSize: '11px', 
    marginTop: '4px', 
    display: 'block',
    fontWeight: '500'
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="brain-icon">🧠</div>
          Smriti AI
        </div>

        <div style={{ display: 'flex', gap: '4px', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '14px' }}>
          {['login', 'signup'].map((t) => (
            <button
              key={t}
              className="btn"
              style={{
                flex: 1, padding: '7px', textAlign: 'center', fontSize: '13px',
                color: authTab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: authTab === t ? 'var(--surface)' : 'transparent',
                boxShadow: authTab === t ? 'var(--shadow-sm)' : 'none',
                borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer'
              }}
              onClick={() => {
                setAuthTab(t);
                setFormData({ fullName: '', contact: '', password: '' });
              }}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {!isLogin && (
          <>
            <div >
              <div className="role-grid">
                {[
                  { r: 'user', i: '👪', n: 'User' },
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

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                className="form-input" 
                placeholder="Khushpreet Kaur"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span style={errorStyle}>{errors.fullName}</span>}
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">Phone / Email</label>
          <input
            type="text"
            name="contact"
            className="form-input"
            placeholder={isLogin ? 'Enter phone or email' : 'khush@example.com'}
            value={formData.contact}
            onChange={handleChange}
          />
          {errors.contact && <span style={errorStyle}>{errors.contact}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            name="password"
            className="form-input" 
            placeholder="••••••••" 
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span style={errorStyle}>{errors.password}</span>}
        </div>

        {isLogin && (
          <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--blue)', marginBottom: '16px', cursor: 'pointer' }}>
            Forgot Password?
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ 
            width: '100%', padding: '12px', fontSize: '14px', marginBottom: '14px',
            opacity: isFormValid ? 1 : 0.5,
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            backgroundColor: isFormValid ? 'var(--blue)' : '#ccc'
          }}
          disabled={!isFormValid}
          onClick={() => setPage('patient')}
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

        <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '10px' }}>
          <span style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={() => setPage('landing')}>
              Back to Home
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;