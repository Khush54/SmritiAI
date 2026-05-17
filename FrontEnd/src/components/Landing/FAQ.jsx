import React, { useState } from 'react';

const FAQ_DATA = [
  {
    q: 'Is Smriti AI a medical diagnosis tool?',
    a: 'No. Smriti AI is a screening and monitoring tool, not a replacement for clinical diagnosis. Our reports are designed to help you have more informed conversations with your doctor. Always consult a qualified neurologist for a definitive diagnosis.'
  },

  {
    q: "Who can see my family member's health data?",
    a: 'Only you (the registered user) can see your family members\' data. Doctors can only access reports if you explicitly share them using the "Share with Doctor" feature in the Reports page. We never sell or share your data with third parties.'
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
    a: 'In our pilot study across multiple neurology centers in India, the AI achieved 93% screening accuracy for early-stage cognitive impairment when validated against MMSE and MoCA clinical benchmarks.'
  },

  {
    q: 'What happens after a high-risk result?',
    a: 'The app flags a critical alert, recommends consulting a neurologist or physician, and generates a shareable PDF report that can be reviewed by your doctor. Smriti AI does not make treatment decisions.'
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