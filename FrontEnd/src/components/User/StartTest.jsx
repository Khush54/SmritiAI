import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import './User.css'

function StartTest({ completeTest, patient }) {
  const { showAlert } = useContext(AppContext);
  const navigate = useNavigate();

  if (!patient) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🧠</div>
        <h2>No Patient Selected</h2>
        <p style={{ color: 'var(--c4)', marginBottom: '20px' }}>Please select a family member from the dashboard to start a test.</p>
        <button className="btn btn-p" onClick={() => navigate('/user/home')}>Go to Dashboard</button>
      </div>
    );
  }
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [answers, setAnswers] = useState({});
  const [analysisDone, setAnalysisDone] = useState(false);
  const [stepStatus, setStepStatus] = useState(['pending', 'pending', 'pending', 'pending', 'pending']);

  const canvasRef = useRef(null);
  const visualizerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);


  useEffect(() => {
    setCurrentStep(0);
    setAnswers({});
    setAudioUrl(null);
    setStepStatus(['pending', 'pending', 'pending', 'pending', 'pending']);
    setAnalysisDone(false);
  }, [patient?.id]); 

  const testSteps = [
    { id: 'voice', title: 'Voice', icon: '🎙️' },
    { id: 'drawing', title: 'Drawing', icon: '✏️' },
    { id: 'memory', title: 'Memory', icon: '🔢' },
    { id: 'behaviour', title: 'Behaviour', icon: '🧠' },
    { id: 'done', title: 'Result', icon: '⚙️' }
  ];

  const validateStep = (index) => {
    let status = 'completed';
    if (index === 0 && !audioUrl) status = 'missed';
    if (index === 1 && !ctxRef.current) status = 'missed'; 
    if (index === 2 && !answers.memoryAns) status = 'missed';
    if (index === 3 && !answers.beh1) status = 'missed';
    
    const newStatus = [...stepStatus];
    newStatus[index] = status;
    setStepStatus(newStatus);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      drawVisualizer();
      
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioUrl(URL.createObjectURL(blob));
        cancelAnimationFrame(animationRef.current);
        const newStatus = [...stepStatus];
        newStatus[0] = 'completed';
        setStepStatus(newStatus);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) { showAlert("Mic access denied! Please enable microphone permissions.", "error"); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const drawVisualizer = () => {
    const canvas = visualizerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame);
      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `#2563EB`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    renderFrame();
  };

  useEffect(() => {
    if (testSteps[currentStep].id === 'drawing' && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 250;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#1F2937'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctxRef.current = ctx;

      const getPos = (e) => {
        const r = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return { x: clientX - r.left, y: clientY - r.top };
      };

      const start = (e) => { isDrawing.current = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
      const move = (e) => { if (!isDrawing.current) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
      const stop = () => { isDrawing.current = false; };

      canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', stop);
      return () => {
        canvas.removeEventListener('mousedown', start); canvas.removeEventListener('mousemove', move); window.removeEventListener('mouseup', stop);
      };
    }
  }, [currentStep]);

  useEffect(() => {
    if (testSteps[currentStep].id === 'done') {
      setTimeout(() => { 
        setAnalysisDone(true); 
      }, 4000);
    }
  }, [currentStep]);

  const renderContent = () => {
    const stepId = testSteps[currentStep].id;
    if (stepId === 'voice') return (
      <div style={{ textAlign: 'center' }}>
        <p className="alert-card-blue">Read: "The quick brown fox jumped over the lazy dog."</p>
        <canvas ref={visualizerRef} style={{ width: '100%', height: '80px', marginBottom: '20px'}} />
        <button className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`} style={{ width: '100%' }} onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? '⏹ Stop Recording' : '🎙️ Start Recording'}
        </button>
        {audioUrl && <audio src={audioUrl} controls style={{ width: '100%', marginTop: '20px' }} />}
      </div>
    );

    if (stepId === 'drawing') return (
      <div>
        <p style={{textAlign: 'center', marginBottom: '10px'}}>Draw a clock showing 10:10</p>
        <canvas ref={canvasRef} style={{ border: '2px solid #eee', borderRadius: '12px', background: '#fff', width: '100%', height: '250px' }} />
        <button className="btn btn-ghost btn-sm" onClick={() => ctxRef.current.clearRect(0,0,2000,2000)}>🗑 Clear</button>
      </div>
    );

    if (stepId === 'memory') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <p><b>Q. What is today's date?</b></p>
        {['28 Oct', '29 Oct', '30 Oct'].map(opt => (
          <div key={opt} className={`test-option ${answers.memoryAns === opt ? 'selected' : ''}`} onClick={() => setAnswers({...answers, memoryAns: opt})}>{opt}</div>
        ))}
      </div>
    );

    if (stepId === 'behaviour') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <p><b>Q. Any difficulty in daily tasks?</b></p>
        {['None', 'Slight', 'Often'].map(opt => (
          <div key={opt} className={`test-option ${answers.beh1 === opt ? 'selected' : ''}`} onClick={() => setAnswers({...answers, beh1: opt})}>{opt}</div>
        ))}
      </div>
    );

    if (stepId === 'done') return (
      <div style={{ textAlign: 'center' }}>
        <div className="loader" style={{ margin: '0 auto' }}></div>
        <h3 style={{ marginTop: '20px' }}>{analysisDone ? "Test Complete!" : "AI is Analyzing..."}</h3>
        <p style={{ color: 'var(--c4)' }}>Generating report for {patient?.name}</p>
        {analysisDone && <button className="btn btn-primary" style={{marginTop: '20px'}} onClick={() => completeTest(answers)}>View Results</button>}
      </div>
    );
  };

  if (patient?.lastTestDate === new Date().toLocaleDateString('en-CA')) {
    return (
      <div className="page" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>Daily Limit Reached</h2>
        <p style={{ color: 'var(--c3)', marginBottom: '30px', lineHeight: '1.6' }}>
          An assessment has already been completed for <strong>{patient.name}</strong> today. 
          To ensure clinical accuracy, we only allow one comprehensive test every 24 hours.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-p" onClick={() => navigate('/user/reports')}>View Today's Report</button>
          <button className="btn btn-s" onClick={() => navigate('/user/home')}>Back Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Testing: {patient?.name || 'New Patient'}</h2>
        <span className="badge bg">Step {currentStep + 1}/5</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '25px' }}>
        {testSteps.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ 
              height: '6px', borderRadius: '10px', 
              background: i === currentStep ? '#2563EB' : stepStatus[i] === 'completed' ? '#10B981' : stepStatus[i] === 'missed' ? '#EF4444' : '#e5e7eb'
            }}></div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '30px', minHeight: '380px' }}>
        {renderContent()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button className="btn btn-s" onClick={() => navigate('/user/home')}>Cancel</button>
        {currentStep < 4 && (
          <button className="btn btn-p" onClick={() => { validateStep(currentStep); setCurrentStep(currentStep + 1); }}>
            {currentStep === 3 ? 'Final Submit' : 'Next Step →'}
          </button>
        )}
      </div>
    </div>
  );
}

export default StartTest;