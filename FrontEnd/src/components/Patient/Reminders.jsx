import React from 'react';

function Reminders({ riskLevel = "High", score = 47 }){
  
  // Base recommendations from your HTML template
  const baseRecs = [
    { icon: '🏥', text: 'Schedule appointment with a neurologist within 2 weeks for clinical evaluation and MRI scan.', priority: 'Urgent', color: 'var(--red)' },
    { icon: '💊', text: 'Discuss with your doctor about Cholinesterase inhibitors (Donepezil, Rivastigmine) for symptomatic management.', priority: 'Important', color: 'var(--amber)' },
    { icon: '🧘', text: 'Incorporate daily cognitive exercises: word puzzles, reading aloud, and music therapy in Hindi or Punjabi.', priority: 'Recommended', color: 'var(--blue)' },
    { icon: '👪', text: 'Inform family members and consider establishing a daily routine support system.', priority: 'Recommended', color: 'var(--blue)' },
    { icon: '🔄', text: 'Re-test in 4 weeks to track progression after intervention.', priority: 'Follow-up', color: 'var(--teal)' },
  ];

  // Logic to suggest specific doctors if risk is High
  const doctorSuggestions = riskLevel === "High" ? [
    { 
      icon: '👨‍⚕️', 
      text: 'Suggested Specialist: Dr. Rajesh Kumar (Neurologist) - Available at City Care Hospital.', 
      priority: 'Doctor Referral', 
      color: 'var(--purple, #8B5CF6)' 
    }
  ] : [];

  // Combining base recommendations with doctor suggestions
  const allRecs = [...doctorSuggestions, ...baseRecs];

  return (
    <div className="card" style={{ 
      marginBottom: '20px', 
      background: 'var(--surface)', 
      padding: '20px', 
      borderRadius: 'var(--radius-lg)', 
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ 
        fontWeight: '600', 
        fontSize: '15px', 
        marginBottom: '16px', 
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>📋</span> AI Recommendations
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {allRecs.map((r, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px', 
              padding: '12px', 
              background: 'var(--gray-50)', 
              borderRadius: 'var(--radius-md)', 
              borderLeft: `3px solid ${r.color}`,
              transition: 'transform 0.2s ease'
            }}
          >
            <span style={{ fontSize: '18px' }}>{r.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: '600', 
                color: r.color, 
                marginBottom: '3px', 
                textTransform: 'uppercase', 
                letterSpacing: '.04em' 
              }}>
                {r.priority}
              </div>
              <div style={{ 
                fontSize: '13.5px', 
                color: 'var(--text-secondary)', 
                lineHeight: '1.5' 
              }}>
                {r.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminders;