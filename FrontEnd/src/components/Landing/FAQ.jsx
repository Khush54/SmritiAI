import React, { useState } from 'react';

const FAQ_DATA = [
  {
    q: 'Is Smriti AI a medical diagnosis tool?',
    a: 'No. Smriti AI is a screening and monitoring tool, not a replacement for clinical diagnosis. Our reports are designed to help you have more informed conversations with your doctor. Always consult a qualified neurologist for a definitive diagnosis.'
  },

  {
    q: "Who can see my family member's health data?",
    a: 'You can see your family members\' data in the patient portal. When Smriti AI assigns or connects a doctor for a patient, that doctor can review the patient reports inside the doctor portal and share clinical notes back to the patient portal.'
  },

  {
    q: 'What languages does the cognitive test support?',
    a: 'The screening is available in 10 Indian languages: English, Hindi, Punjabi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, and Malayalam. You can set a preferred language individually for each family member from their Settings page.'
  },

  {
    q: 'How often should the screening be taken?',
    a: 'We recommend one test per day for each family member to help track cognitive changes over time. The app includes a 24-hour cooldown between tests to maintain consistency and accuracy.'
  },

  {
    q: 'Is the app free to use?',
    a: 'Yes — the core screening, daily mood log, and basic reports are completely free. We believe early detection and monitoring should be accessible to all families regardless of income.'
  },

  {
    q: 'How accurate is the AI detection?',
    a: 'Smriti AI is designed as a screening and monitoring system, not a standalone diagnosis. The risk score is calculated from structured task performance and then summarized for doctor review.'
  },

  {
    q: 'What happens after a high-risk result?',
    a: 'The app flags a critical alert, recommends an available doctor near the patient when possible, and shows that doctor in Doctor Contact. If the doctor shares notes or asks the patient to visit, the patient sees it in alerts and Doctor Contact.'
  }
];

function FAQ() {
  const [open, setOpen] = useState(0);

  const toggleFAQ = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <section className="section faq-section" id="faq">

      <div className="faq-top">

        <div className="section-label">
          Frequently Asked Questions
        </div>

        <p className="faq-subtitle">
          Everything users and doctors ask before getting started with Smriti AI.
        </p>

      </div>

      <div className="faq-list">

        {FAQ_DATA.map((item, i) => (

          <div
            key={i}
            className={`faq-item ${open === i ? 'active' : ''}`}
          >

            <button
              className="faq-question"
              onClick={() => toggleFAQ(i)}
              aria-expanded={open === i}
            >

              <span>{item.q}</span>

              <div className="faq-icon-wrapper">

                <span className="faq-chevron">
                  ▾
                </span>

              </div>

            </button>

            <div
              className={`faq-answer-wrapper ${
                open === i ? 'open' : ''
              }`}
            >

              <div className="faq-answer">
                {item.a}
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default FAQ;
