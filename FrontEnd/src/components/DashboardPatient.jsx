import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const DashboardPatient = ({ setPage }) => {
  // const lineChartRef = useRef(null);
  // const gaugeChartRef = useRef(null);
  
  // const [userStats, setUserStats] = useState({
  //   score: 47,
  //   memoryTrend: [75, 70, 62, 55, 48, 47],
  //   behaviourTrend: [80, 78, 70, 65, 60, 52],
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  // });

  // useEffect(() => {
  //   const ctxLine = lineChartRef.current.getContext('2d');
  //   const lineChart = new Chart(ctxLine, {
  //     type: 'line',
  //     data: {
  //       labels: userStats.labels,
  //       datasets: [
  //         {
  //           label: 'Memory',
  //           data: userStats.memoryTrend,
  //           borderColor: '#2563EB',
  //           backgroundColor: 'rgba(37, 99, 235, 0.1)',
  //           tension: 0.4,
  //           fill: true
  //         },
  //         {
  //           label: 'Behaviour',
  //           data: userStats.behaviourTrend,
  //           borderColor: '#0D9488',
  //           tension: 0.4,
  //         }
  //       ]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       plugins: { legend: { display: false } },
  //       scales: { 
  //         y: { beginAtZero: true, max: 100, grid: { display: false } },
  //         x: { grid: { display: false } }
  //       }
  //     }
  //   });

  //   // Gauge Chart Instance
  //   const ctxGauge = gaugeChartRef.current.getContext('2d');
  //   const gaugeChart = new Chart(ctxGauge, {
  //     type: 'doughnut',
  //     data: {
  //       datasets: [{
  //         data: [userStats.score, 100 - userStats.score],
  //         backgroundColor: [userStats.score > 40 ? '#EF4444' : '#10B981', 'var(--gray-100)'],
  //         borderWidth: 0,
  //         circumference: 180,
  //         rotation: 270,
  //         borderRadius: 10
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       cutout: '85%',
  //       plugins: { tooltip: { enabled: false } }
  //     }
  //   });

  //   return () => {
  //     lineChart.destroy();
  //     gaugeChart.destroy();
  //   };
  // }, [userStats]); 

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h1 className="section-title">Hello User</h1>
          <p className="section-sub">Cognitive health overview for **Smriti AI**</p>
        </div>
        
        {/* <button className="btn btn-ghost btn-sm" onClick={() => setUserStats({
          ...userStats,
          score: 65, // Score update kar diya
          memoryTrend: [...userStats.memoryTrend, 65],
          labels: [...userStats.labels, 'Jul']
        })}>
          Simulate New Data
        </button> */}
      </div>

      {/* <div className="grid-2">
        <div className="card">
          <div style={{fontWeight: '600', marginBottom: '10px'}}>Memory vs Behaviour</div>
          <div style={{ height: '220px' }}>
            <canvas ref={lineChartRef}></canvas>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{fontWeight: '600', marginBottom: '10px'}}>Current Risk Score</div>
          <div style={{ position: 'relative', height: '150px', width: '200px', margin: '0 auto' }}>
            <canvas ref={gaugeChartRef}></canvas>
            <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: userStats.score > 40 ? 'var(--red)' : 'var(--green)' }}>
                {userStats.score}
              </span>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/100</span>
            </div>
          </div>
          <div className={`badge ${userStats.score > 40 ? 'badge-red' : 'badge-green'}`} style={{marginTop: '10px'}}>
            {userStats.score > 40 ? 'High Risk' : 'Low Risk'}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DashboardPatient;