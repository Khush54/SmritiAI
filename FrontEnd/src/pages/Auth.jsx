import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  auth,
  googleProvider
} from "../Firebase/firebase";

import {
  saveUserToDB,
  loginUser
} from "../services/authService";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const navigate = useNavigate();
  const [authTab, setAuthTab] = useState('signup');
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({ fullName: '', contact: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "" });
  const isLogin = authTab === 'login';

  const showModal = (message) => {
    setModal({ show: true, message });
    setTimeout(() => {
      setModal({ show: false, message: "" });
    }, 2500);
  };

  const errorStyle = {
    color: '#ff4d4d',
    fontSize: '11px',
    marginTop: '4px',
    display: 'block',
    fontWeight: '500'
  };

  const validate = () => {
    let newErrors = {};
    if (!isLogin) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Name is required';
      }
      else if (!nameRegex.test(formData.fullName)) {
        newErrors.fullName = 'Only alphabets are allowed';
      }
      else if (formData.fullName.trim().length < 3) {
        newErrors.fullName = 'Minimum 3 characters required';
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.contact.trim()) {
      newErrors.contact = 'Email is required';
    }
    else {
      const isEmail = emailRegex.test(formData.contact);
      if (!isEmail) {
        newErrors.contact = 'Enter valid email';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 characters required';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  const handleTabChange = (tab) => {
    setAuthTab(tab);
    setFormData({
      fullName: '',
      contact: '',
      password: ''
    });
    setErrors({});
    setTouched({});
  };

  const isFormValid = () => {
    const validationErrors = validate();
    return (
      Object.keys(validationErrors).length === 0
    );
  };

  const isRoleSelected = () => {
    return selectedRole !== '';
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      showModal("Please select a role");
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      setLoading(true);
      if (isLogin) {
        const firebaseUser = await signInWithEmailAndPassword(
          auth,
          formData.contact,
          formData.password
        );

        const user = firebaseUser.user;
        const data = await loginUser(user.uid);
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        if (selectedRole !== data.user.role) {

          showModal(
            `This account is registered as ${data.user.role}`
          );

          await auth.signOut();

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          return;
        }

        if (data.user.role === "doctor") {
          window.location.href = "/doctor/home";
        } else {
          window.location.href = "/user/home";
        }
      }

      else {
        const firebaseUser = await createUserWithEmailAndPassword(
          auth,
          formData.contact,
          formData.password
        );

        const user = firebaseUser.user;
        await saveUserToDB({
          firebaseUID: user.uid,
          fullName: formData.fullName,
          email: formData.contact,
          role: selectedRole,
          authProvider: "email"
        });

        showModal("Account Created Successfully");
        setFormData({
          fullName: "",
          contact: "",
          password: ""
        });
        setErrors({});
        setTouched({});
        setAuthTab("login");
        return;
      }
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        showModal("Email already exists");
      }
      else if (error.code === "auth/invalid-credential") {
        showModal("Invalid email or password");
      }
      else if (error.code === "auth/user-not-found") {
        showModal("User not found");
      }
      else if (error.code === "auth/wrong-password") {
        showModal("Wrong password");
      }
      else if (error.code === "auth/weak-password") {
        showModal("Password should be at least 6 characters");
      }
      else if (
        error.code === "auth/cancelled-popup-request"
      ) {

        showModal(
          "Authentication popup already open"
        );

      }

      else {

        showModal(
          error.message
        );

      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {

    if (loading) return;

    if (!selectedRole) {
      showModal("Please select a role");
      return;
    }

    try {

      setLoading(true);

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const user = result.user;

      const data = await saveUserToDB({
        firebaseUID: user.uid,
        fullName: user.displayName,
        email: user.email,
        role: selectedRole,
        authProvider: "google"
      });

      if (selectedRole !== data.user.role) {

        showModal(
          `This account is registered as ${data.user.role}`
        );

        await auth.signOut();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      if (data.user.role === "doctor") {
        window.location.href = "/doctor/home";
      } else {
        window.location.href = "/user/home";
      }

    } catch (error) {

      console.log(error);

      if (
        error.code === "auth/cancelled-popup-request"
      ) {
        showModal(
          "Authentication popup already open"
        );
      }

      else {
        showModal(error.message);
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
      <div className="auth-card">
        <div className="auth-logo">
          <div className="brain-icon">
            🧠
          </div>
          Smriti AI
        </div>

        <div
          style={{
            display: 'flex',
            gap: '4px',
            background: 'var(--gray-100)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '14px'
          }}
        >
          {['login', 'signup']
            .map((t) => (
              <button
                key={t}
                className="btn"
                style={{
                  flex: 1,
                  padding: '7px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: authTab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: authTab === t ? 'var(--surface)' : 'transparent',
                  boxShadow: authTab === t ? 'var(--shadow-sm)' : 'none',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  handleTabChange(t)
                }
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="role-grid">
            {[
              {
                r: 'user',
                i: '👪',
                n: 'User'
              },
              {
                r: 'doctor',
                i: '👩‍⚕️',
                n: 'Doctor'
              }
            ].map((role) => (
              <div
                key={role.r}
                className={`role-card ${selectedRole === role.r ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role.r)}
              >
                <div className="role-icon">
                  {role.i}
                </div>
                <div className="role-name">
                  {role.n}
                </div>
              </div>
            ))}
          </div>



          {!isLogin && (
            <div className="form-group">
              <label className="form-label">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="Khushpreet Kaur"
                value={formData.fullName}
                onChange={handleChange}
              />
              {touched.fullName && errors.fullName && (
                <span style={errorStyle}>
                  {errors.fullName}
                </span>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Email
            </label>
            <input
              type="text"
              name="contact"
              className="form-input"
              placeholder={isLogin ? 'Enter email' : 'khush@example.com'}
              value={formData.contact}
              onChange={handleChange}
            />
            {touched.contact && errors.contact && (
              <span style={errorStyle}>
                {errors.contact}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            {touched.password && errors.password && (
              <span style={errorStyle}>
                {errors.password}
              </span>
            )}
          </div>

          {isLogin && (
            <div
              style={{
                textAlign: 'right',
                fontSize: '12px',
                color: 'var(--blue)',
                marginBottom: '16px',
                cursor: 'pointer'
              }}
            >
              Forgot Password?
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              marginBottom: '14px',
              opacity: isFormValid() && isRoleSelected() ? 1 : 0.5,
              cursor: isFormValid() && isRoleSelected() ? 'pointer' : 'not-allowed',
              backgroundColor: isFormValid() && isRoleSelected() ? 'var(--blue)' : '#ccc'
            }}
            disabled={!isFormValid() || !isRoleSelected() || loading}
            onClick={handleSubmit}
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

        </form>
        <div className="divider-text">
          or continue with
        </div>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '10px'
          }}
        >
          <button
            className="btn btn-secondary"
            style={{
              flex: 1,
              padding: '9px',
              fontSize: '13px',
              opacity: isRoleSelected() ? 1 : 0.5,
              cursor: isRoleSelected() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            disabled={!isRoleSelected()}
            onClick={handleGoogleAuth}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '16px', height: '16px' }} /> Sign in with Google
          </button>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '20px'
          }}
        >
          {isLogin ? (
            <>
              New to Smriti AI?{' '}
              <span
                style={{
                  color: 'var(--blue)',
                  cursor: 'pointer'
                }}
                onClick={() => handleTabChange('signup')}
              >
                Create account
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span
                style={{
                  color: 'var(--blue)',
                  cursor: 'pointer'
                }}
                onClick={() => handleTabChange('login')}
              >
                Sign in
              </span>
            </>
          )}
        </p>

        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            marginTop: '10px'
          }}
        >
          <span
            style={{
              color: 'var(--blue)',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            Back to Home
          </span>
        </p>
      </div>

      {
        modal.show && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
              animation: 'slideIn 0.3s ease'
            }}
          >
            <div
              style={{
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                padding: '14px 18px',
                borderRadius: '14px',
                minWidth: '260px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                fontWeight: '500',
                backdropFilter: 'blur(12px)'
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  flexShrink: 0
                }}
              />
              <span>
                {modal.message}
              </span>
            </div>
          </div>
        )
      }
    </div >
  );
}

export default Auth;