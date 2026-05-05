import React, { useState, useEffect } from 'react';
import './User.css'

const Mood = ({ patient }) => {
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
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sleep: 'Good (7+ hrs)',
    appetite: 'Normal',
    notes: ''
  });

  useEffect(() => {
    setEntries(patient.moodLogs || []);
  }, [patient]);

  const moods = ['😄', '😊', '😐', '😔', '😤', '😰'];

  const handleSave = () => {
    if (!formData.notes.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      date: formData.date,
      text: formData.notes,
      sleep: formData.sleep,
      appetite: formData.appetite
    };

    setEntries([newEntry, ...entries]);
    setFormData({ ...formData, notes: '' });
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
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
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

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-p" onClick={handleSave}>Save Log</button>
        </div>
      </div>

      <div className="card">
        <div className="sh-title" style={{ marginBottom: '16px' }}>Log History for {patient.name}</div>
        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--c4)' }}>
            No logs found for this patient.
          </div>
        ) : (
          entries.map((l) => (
            <div className="act-it" key={l.id} style={{ display: 'flex', gap: '15px', padding: '15px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '32px' }}>{l.mood}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{l.date}</div>
                <div style={{ fontSize: '13.5px', margin: '4px 0' }}>{l.text}</div>
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