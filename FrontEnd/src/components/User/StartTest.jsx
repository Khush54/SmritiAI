import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { generateDynamicTest, submitAssessment as submitAssessmentAPI } from '../../Services/assessmentService';
import './User.css';

function StartTest({ completeTest, patient }) {
  const { showAlert } = useContext(AppContext);
  const navigate = useNavigate();

  // --- State Architecture ---
  const [loadingTest, setLoadingTest] = useState(true);
  const [dynamicData, setDynamicData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  // Pagination sub-counters for dynamic questions array arrays
  const [memoryIndex, setMemoryIndex] = useState(0);
  const [behaviorIndex, setBehaviorIndex] = useState(0);

  const [answers, setAnswers] = useState({
    memoryAnswers: {},    
    behaviorAnswers: {},  
    gameScore: 0,
    gameTimeSec: 0,
    speechDurationSec: 0
  });

  const [analysisDone, setAnalysisDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [stepStatus, setStepStatus] = useState(['pending', 'pending', 'pending', 'pending', 'pending']);

  // Pattern matrix configs
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [userClicks, setUserClicks] = useState([]);

  // --- Reference Nodes ---
  const startTimeRef = useRef(null);
  const visualizerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  // Hook: Pull unique anti-bias diagnostic dataset on mount
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoadingTest(true);
        const data = await generateDynamicTest(patient?.language || 'en', patient);
        if (data.success) {
          setDynamicData(data.testData);
        } else {
          showAlert("Failed to initialize cognitive parameter grid", "error");
        }
      } catch {
        showAlert("Error talking to backend AI orchestration layer", "error");
      } finally {
        setLoadingTest(false);
      }
    };

    if (patient?.id && patient?.lastTestDate !== new Date().toLocaleDateString('en-CA')) {
      fetchTestData();
    }

    // Standard states resets
    setCurrentStep(0);
    setMemoryIndex(0);
    setBehaviorIndex(0);
    setAnswers({ memoryAnswers: {}, behaviorAnswers: {}, gameScore: 0, gameTimeSec: 0, speechDurationSec: 0 });
    setAudioUrl(null);
    setUserClicks([]);
    setIsShowingPattern(false);
    setStepStatus(['pending', 'pending', 'pending', 'pending', 'pending']);
    setAnalysisDone(false);
    setAiReport(null);
  }, [patient?.id]);

  const testSteps = [
    { id: 'voice', title: 'Speech', icon: '🎙️' },
    { id: 'game', title: 'Pattern Matrix', icon: '🎮' },
    { id: 'memory', title: 'Memory Tasks', icon: '🔢' },
    { id: 'behaviour', title: 'Self Check', icon: '🧠' },
    { id: 'done', title: 'Report', icon: '⚙️' }
  ];

  const validateStep = (index) => {
    let status = 'completed';
    if (index === 0 && !audioUrl) status = 'missed';
    if (index === 1 && userClicks.length < (dynamicData?.cognitiveGame?.length || 3)) status = 'missed';
    if (index === 2 && Object.keys(answers.memoryAnswers).length < 5) status = 'missed';
    if (index === 3 && Object.keys(answers.behaviorAnswers).length < 5) status = 'missed';
    
    const newStatus = [...stepStatus];
    newStatus[index] = status;
    setStepStatus(newStatus);
  };

  // --- Voice Interface Trackers ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];
      startTimeRef.current = Date.now();

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      drawVisualizer();
      
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const duration = (Date.now() - startTimeRef.current) / 1000;
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        
        setAudioUrl(URL.createObjectURL(blob));
        setAnswers(prev => ({ ...prev, speechDurationSec: duration }));
        cancelAnimationFrame(animationRef.current);

        const newStatus = [...stepStatus];
        newStatus[0] = 'completed';
        setStepStatus(newStatus);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch { 
      showAlert("Microphone system access denied.", "error"); 
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
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

  // Cleanup voice recording and animation when changing steps
  useEffect(() => {
    if (currentStep !== 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }
  }, [currentStep]);

  // --- Dynamic Short-Term Spatial Memory Game ---
  useEffect(() => {
    if (dynamicData && testSteps[currentStep].id === 'game') {
      setIsShowingPattern(true);
      setUserClicks([]);
      
      const timer = setTimeout(() => {
        setIsShowingPattern(false);
        startTimeRef.current = Date.now();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [currentStep, dynamicData]);

  const handleGridClick = (index) => {
    const targets = dynamicData?.cognitiveGame || [];
    if (isShowingPattern || userClicks.includes(index) || userClicks.length >= targets.length) return;

    const newClicks = [...userClicks, index];
    setUserClicks(newClicks);

    if (newClicks.length === targets.length) {
      const timeTaken = (Date.now() - startTimeRef.current) / 1000;
      const correctMatches = newClicks.filter(idx => targets.includes(idx)).length;
      const finalScore = (correctMatches / targets.length) * 100;

      setAnswers(prev => ({
        ...prev,
        gameScore: finalScore,
        gameTimeSec: timeTaken
      }));
      showAlert("Short-term pattern metrics logged.", "success");
    }
  };

  // --- Data Core Pipeline Delivery ---
  useEffect(() => {
    if (testSteps[currentStep].id === 'done' && !isSubmitting && !aiReport) {
      submitAssessment();
    }
  }, [currentStep]);

 const submitAssessment = async () => {
    setIsSubmitting(true);
    try {
      // FIX: FormData ki jagah clean, native JSON object ka use karo
      const payload = {
        patientId: patient.id,
        patientAge: patient.age || 65,
        speechDuration: answers.speechDurationSec,
        gameScore: answers.gameScore,
        gameTimeSec: answers.gameTimeSec,
        memoryAnswer: {
          answers: answers.memoryAnswers,
          questions: dynamicData?.memoryQuestions || []
        },
        behaviorAnswer: answers.behaviorAnswers // Direct object pass karo
      };

      const data = await submitAssessmentAPI(payload);

      if (data.success) {
        setAiReport(data.report);
        setAnalysisDone(true);
        setApiResponse(data);
      } else {
        showAlert("Analysis Pipeline Interrupted: " + data.message, "error");
      }
    } catch {
      showAlert("Server communication timeout error.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- Render Dynamic Segment Layouts ---
  const renderContent = () => {
    if (loadingTest) {
      return (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="loader" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '20px', color: 'var(--c3)', fontWeight: '500' }}>Assembling unique non-repetitive screening questions...</p>
        </div>
      );
    }

    const stepId = testSteps[currentStep].id;
    
    if (stepId === 'voice') return (
      <div style={{ textAlign: 'center', padding: '10px' }}>
        <div className="alert-card-blue" style={{ fontSize: '1.15rem', padding: '20px', borderRadius: '16px', lineHeight: '1.6' }}>
          <span>Please read this line out loud:</span>
          <div style={{ fontSize: '1.3rem', color: '#1E3A8A', fontWeight: 'bold', marginTop: '10px' }}>
            "{dynamicData?.voicePhrase}"
          </div>
        </div>
        <canvas ref={visualizerRef} style={{ width: '100%', height: '80px', marginBottom: '25px', borderRadius: '8px'}} />
        <button className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`} style={{ width: '100%', padding: '15px', fontSize: '1.1rem', borderRadius: '14px' }} onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? '⏹ Stop Recording' : '🎙️ Start Recording'}
        </button>
        {audioUrl && <audio src={audioUrl} controls style={{ width: '100%', marginTop: '20px' }} />}
      </div>
    );

    if (stepId === 'game') return (
      <div style={{ textAlign: 'center', padding: '10px' }}>
        <p style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: '500', color: '#374151' }}>
          {isShowingPattern ? "🧠 Watch carefully and remember the highlighted boxes..." : "👇 Tap on the same boxes you just saw!"}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '280px', margin: '0 auto 25px' }}>
          {Array(9).fill(null).map((_, idx) => {
            let bgStyle = '#E5E7EB';
            if (isShowingPattern && dynamicData?.cognitiveGame?.includes(idx)) bgStyle = '#2563EB';
            if (!isShowingPattern && userClicks.includes(idx)) bgStyle = '#4B5563';

            return (
              <div 
                key={idx} 
                onClick={() => handleGridClick(idx)}
                style={{ height: '80px', background: bgStyle, borderRadius: '16px', cursor: isShowingPattern ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', transform: !isShowingPattern && userClicks.includes(idx) ? 'scale(0.95)' : 'none' }}
              />
            );
          })}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setUserClicks([])} disabled={isShowingPattern || userClicks.length === 0}>🔄 Reset Selection</button>
      </div>
    );

    if (stepId === 'memory') {
      const q = dynamicData?.memoryQuestions[memoryIndex];
      if (!q) return <p style={{ color: 'var(--c4)', textAlign: 'center', padding: '20px' }}>Question data missing or invalid.</p>;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span className="badge bg-blue" style={{ fontSize: '14px', padding: '6px 12px' }}>Question {memoryIndex + 1} of 5</span>
            <span style={{ color: 'var(--c4)', fontSize: '14px' }}>Cognitive Skill Task</span>
          </div>
          
          <p style={{ fontSize: '1.35rem', fontWeight: '600', color: '#1F2937', lineHeight: '1.5', margin: '10px 0' }}>
            {q?.question}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {q?.options.map(opt => (
              <div 
                key={opt} 
                className={`test-option ${answers.memoryAnswers[q.id] === opt ? 'selected' : ''}`} 
                style={{ 
                  padding: '20px', fontSize: '1.15rem', borderRadius: '16px', 
                  border: answers.memoryAnswers[q.id] === opt ? '2px solid #2563EB' : '1px solid #E5E7EB',
                  backgroundColor: answers.memoryAnswers[q.id] === opt ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
                onClick={() => setAnswers({
                  ...answers, 
                  memoryAnswers: { ...answers.memoryAnswers, [q.id]: opt }
                })}
              >
                {opt}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <button className="btn btn-ghost" disabled={memoryIndex === 0} onClick={() => setMemoryIndex(memoryIndex - 1)}>← Previous</button>
            {memoryIndex < (dynamicData?.memoryQuestions?.length || 5) - 1 ? (
              <button className="btn btn-primary" disabled={!answers.memoryAnswers[q?.id]} onClick={() => setMemoryIndex(memoryIndex + 1)}>
                Next Question →
              </button>
            ) : (
              <p style={{ color: '#10B981', fontWeight: '500', margin: 0 }}>✓ Dynamic Memory section checked!</p>
            )}
          </div>
        </div>
      );
    }

    if (stepId === 'behaviour') {
      const q = dynamicData?.behaviorQuestions[behaviorIndex];
      if (!q) return <p style={{ color: 'var(--c4)', textAlign: 'center', padding: '20px' }}>Question data missing or invalid.</p>;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge bg-purple" style={{ fontSize: '14px', padding: '6px 12px' }}>Self-Check {behaviorIndex + 1} of 5</span>
            <span style={{ color: 'var(--c4)', fontSize: '14px' }}>Self-Awareness Diary</span>
          </div>

          <p style={{ fontSize: '1.35rem', fontWeight: '600', color: '#1F2937', lineHeight: '1.5', margin: '10px 0' }}>
            {q?.question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {q?.options.map(opt => (
              <div 
                key={opt} 
                className={`test-option ${answers.behaviorAnswers[q.id] === opt ? 'selected' : ''}`} 
                style={{ 
                  padding: '20px', fontSize: '1.15rem', borderRadius: '16px',
                  border: answers.behaviorAnswers[q.id] === opt ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                  backgroundColor: answers.behaviorAnswers[q.id] === opt ? '#F5F3FF' : '#FFFFFF',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
                onClick={() => setAnswers({
                  ...answers, 
                  behaviorAnswers: { ...answers.behaviorAnswers, [q.id]: opt }
                })}
              >
                {opt}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <button className="btn btn-ghost" disabled={behaviorIndex === 0} onClick={() => setBehaviorIndex(behaviorIndex - 1)}>← Previous</button>
            {behaviorIndex < (dynamicData?.behaviorQuestions?.length || 5) - 1 ? (
              <button className="btn btn-purple" disabled={!answers.behaviorAnswers[q?.id]} onClick={() => setBehaviorIndex(behaviorIndex + 1)} style={{ backgroundColor: '#7C3AED', color: '#fff' }}>
                Next Question →
              </button>
            ) : (
              <p style={{ color: '#10B981', fontWeight: '500', margin: 0 }}>✓ Self awareness metrics saved!</p>
            )}
          </div>
        </div>
      );
    }

    if (stepId === 'done') return (
      <div style={{ textAlign: 'center', padding: '30px 10px' }}>
        <div className="loader" style={{ margin: '0 auto' }}></div>
        <h3 style={{ marginTop: '25px', fontSize: '1.4rem' }}>{analysisDone ? "Diagnostic Matrix Prepared!" : "Smriti AI Multimodal Engine Analyzing..."}</h3>
        <p style={{ color: 'var(--c4)', marginTop: '5px' }}>Synthesizing speech acoustics, visual-spatial tracks, and computational logs...</p>
        {analysisDone && <button className="btn btn-primary" style={{marginTop: '30px', width: '100%', padding: '14px', fontSize: '1.1rem'}} onClick={() => completeTest(apiResponse)}>📊 View Dynamic Analysis Report</button>}
      </div>
    );
  };

  if (!patient) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 700 }}>Smriti AI</div>
        <h2>No Patient Selected</h2>
        <p style={{ color: 'var(--c4)', marginBottom: '20px' }}>Please select a profile from the dashboard to start the self-assessment.</p>
        <button className="btn btn-p" onClick={() => navigate('/user/home')}>Go to Dashboard</button>
      </div>
    );
  }

  if (patient?.lastTestDate === new Date().toLocaleDateString('en-CA')) {
    return (
      <div className="page" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
        <h2>Daily Assessment Complete</h2>
        <p style={{ color: 'var(--c3)', marginBottom: '30px', lineHeight: '1.6', fontSize: '1.1rem' }}>
          An assessment has already been registered for <strong>{patient.name}</strong> within this 24-hour window. To ensure accurate clinical baseline tracking, only one comprehensive diagnostic routine is allowed daily.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-p" onClick={() => navigate('/user/reports')}>Open Clinical Dashboard</button>
          <button className="btn btn-s" onClick={() => navigate('/user/home')}>Back Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '20px', margin: 0, fontWeight: '600', color: '#111827' }}>Screening Module: {patient?.name}</h2>
        <span className="badge bg" style={{ fontSize: '13px', padding: '5px 10px' }}>Block {currentStep + 1} of 5</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {testSteps.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ 
              height: '8px', borderRadius: '12px', 
              background: i === currentStep ? '#2563EB' : stepStatus[i] === 'completed' ? '#10B981' : stepStatus[i] === 'missed' ? '#EF4444' : '#E5E7EB',
              transition: 'all 0.3s'
            }}></div>
          </div>
        ))}
      </div>

      <div className="card" style={{ minHeight: '440px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', backgroundColor: '#fff', border: '1px solid #F3F4F6' }}>
        {renderContent()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', flexWrap: 'wrap', gap: '10px' }}>
        <button className="btn btn-s" style={{ borderRadius: '12px', padding: '10px 20px' }} disabled={currentStep === 4} onClick={() => navigate('/user/home')}>Cancel Test</button>
        {currentStep < 4 && (
          <button 
            className="btn btn-p" 
            style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '1rem' }}
            disabled={
              loadingTest ||
              (currentStep === 2 && Object.keys(answers.memoryAnswers).length < 5) ||
              (currentStep === 3 && Object.keys(answers.behaviorAnswers).length < 5)
            }
            onClick={() => { validateStep(currentStep); setCurrentStep(currentStep + 1); }}
          >
            {currentStep === 3 ? 'Final Submit 🚀' : 'Next Section →'}
          </button>
        )}
      </div>
    </div>
  );
}

export default StartTest;
