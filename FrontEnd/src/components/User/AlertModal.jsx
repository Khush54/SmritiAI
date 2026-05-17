import React from 'react';
import './User.css';

const AlertModal = ({ isOpen, message, type = 'info', onClose }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return 'var(--blue)';
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div className="card" style={{
        width: '90%', maxWidth: '400px', textAlign: 'center', padding: '30px',
        animation: 'pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        borderTop: `6px solid ${getColor()}`
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{getIcon()}</div>
        <h3 style={{ marginBottom: '12px', color: 'var(--c0)' }}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </h3>
        <p style={{ color: 'var(--c3)', marginBottom: '24px', lineHeight: 1.6 }}>{message}</p>
        <button 
          className="btn btn-p" 
          style={{ width: '100%', justifyContent: 'center', background: getColor() }}
          onClick={onClose}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
