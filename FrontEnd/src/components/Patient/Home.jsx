import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
function Home({ setPage }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  return (
    <div className="page">
      <div className="ph">
        <div className="ph-row">
          {/* Welcome Text */}
          <div>
            <h1>Good morning ☀️</h1>
            <p>Your cognitive health dashboard {today}</p>
          </div>

          {/* Action Buttons */}
          <div className="ph-actions">
            <button
              className="btn btn-s btn-sm"
              onClick={() => window.print()}
            >
              📥 Download Report
            </button>

            <button
              className="btn btn-p"
              onClick={() => setPage('test')}
            >
              🧪 Start New Test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Home;