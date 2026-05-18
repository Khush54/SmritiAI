import React, { useState, useEffect, useContext } from 'react';
import { addMoodLog, getMoodLogs } from '../../Services/moodService';
import { AppContext } from '../../context/AppContext';
import './User.css'

const Mood = ({ patient, onUpdatePatient }) => {
  const { showAlert } = useContext(AppContext);
  if (!patient) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🧠</div>
        <h2>Select a Patient</h2>
        <p>Please select a family member to manage their daily logs.</p>
      </div>
    );
  }

  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState('😊');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sleep: 'Good (7+ hrs)',
    appetite: 'Normal',
    notes: ''
  });

  useEffect(() => {
    const fetchLogs = async () => {
      if (patient) {
        try {
          const pId = patient.id || patient._id;
          const res = await getMoodLogs(pId);
          if (res.success) {
            setEntries(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch logs", error);
        }
      }
    };
    fetchLogs();
  }, [patient]);

  const moods = ['😄', '😊', '😐', '😔', '😤', '😰'];

  const handleSave = async () => {
    try {
      setLoading(true);
      const pId = patient.id || patient._id;
      
      if (!pId) {
        showAlert("Patient ID missing. Please select a patient again.", "error");
        return;
      }

      const res = await addMoodLog({
        patientId: pId,
        mood: selectedMood,
        date: formData.date,
        notes: formData.notes,
        sleep: formData.sleep,
        appetite: formData.appetite
      });

      if (res.success) {
        setEntries([res.data, ...entries]);
        if (res.patient) {
          onUpdatePatient?.(res.patient);
        }
        setFormData({ ...formData, notes: '' });
        showAlert("Log saved successfully!", "success");
      } else {
        showAlert(res.message || "Failed to save log", "error");
      }
    } catch (error) {
      console.error("Failed to save log", error);
      showAlert(error.response?.data?.message || "Failed to save log. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Daily Log & Mood</h1>
            <p>Tracking observations for <strong>{patient.name}</strong></p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid var(--warm)' }}>
        <div className="sh-title" style={{ marginBottom: '16px' }}>📝 Add Today's Entry</div>
        
        <div className="g2">
          <div className="field">
            <label className="flabel">Date</label>
            <input 
              className="finput" type="date" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="flabel">How is {patient.name} feeling?</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
              {moods.map((m) => (
                <div 
                  key={m}
                  className={`mood-btn ${selectedMood === m ? 'sel' : ''}`} 
                  onClick={() => setSelectedMood(m)}
                  style={{ 
                    fontSize: '24px', cursor: 'pointer', padding: '8px',
                    borderRadius: '10px', background: selectedMood === m ? 'var(--warm)' : 'transparent',
                    transition: '0.2s'
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="g2">
          <div className="field">
            <label className="flabel">Sleep Quality</label>
            <select className="finput" value={formData.sleep} onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}>
              <option>Good (7+ hrs)</option>
              <option>Fair (5-7 hrs)</option>
              <option>Poor (&lt;5 hrs)</option>
            </select>
          </div>
          <div className="field">
            <label className="flabel">Appetite</label>
            <select className="finput" value={formData.appetite} onChange={(e) => setFormData({ ...formData, appetite: e.target.value })}>
              <option>Normal</option>
              <option>Good</option>
              <option>Low</option>
              <option>Very Poor</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label className="flabel">Observations & Notes</label>
          <textarea 
            className="finput" rows="3" 
            placeholder="Any confusion, repetitive questions, or notable incidents?" 
            style={{ resize: 'none' }}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          ></textarea>
        </div>

        {patient.lastLogDate === new Date().toLocaleDateString('en-CA') ? (
          <div className="alert-card-blue" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontWeight: 700, color: 'var(--blue)' }}>Daily Log Completed</div>
            <p style={{ fontSize: '13px', margin: '4px 0 0' }}>You have already saved a log for {patient.name} today. Please come back tomorrow!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-p" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Log'}
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <div className="sh-title" style={{ marginBottom: '16px' }}>Log History for {patient.name}</div>
        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--c4)' }}>
            No logs found for this patient.
          </div>
        ) : (
          entries.map((l) => (
            <div className="act-it" key={l._id || l.id} style={{ display: 'flex', gap: '15px', padding: '15px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '32px' }}>{l.mood}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{l.date}</div>
                <div style={{ fontSize: '13.5px', margin: '4px 0' }}>{l.notes}</div>
                <div style={{ fontSize: '11px', color: 'var(--c4)' }}>
                  Sleep: {l.sleep} • Appetite: {l.appetite}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Mood;