import React, { useState } from 'react';

function Navbar({ setPage }) {

  const handleLanguageChange = (langCode) => {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
      googleSelect.value = langCode;
      googleSelect.dispatchEvent(new Event('change'));
      setTimeout(() => {
        document.body.style.top = "0px";
        const frame = document.querySelector('.goog-te-banner-frame');
        if (frame) frame.style.display = 'none';
      }, 10);
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="app-nav">
        <div className="main-nav-brand" onClick={() => setPage('landing')}>
          <div className="brain-icon">🧠</div>
          Smriti AI
        </div>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✖' : '☰'}
        </button>

        <div className={`main-nav-right ${menuOpen ? 'open' : ''}`}>
          <ul className='main-nav-links'>
            <li className='main-nav-link'><a href='#hero'>Home</a></li>
            <li className='main-nav-link'><a href='#feature'>Features</a></li>
            <li className='main-nav-link'><a href='#process'>Process</a></li>
            <li className='main-nav-link'><a href='#testimonials'>Testimonials</a></li>
            <li className='main-nav-link'><a href='#faq'>FAQ</a></li>
          </ul>

          <button className="btn btn-secondary btn-md" onClick={() => setPage('auth')}>
            Sign In
          </button>

          <button className="btn btn-primary btn-md" onClick={() => setPage('auth')}>
            Get Started
          </button>

          <select
            className="custom-lang-select"  
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en" className='notranslate'>English</option>
            <option value="hi" className='notranslate'>Hindi (हिंदी)</option>
            <option value="pa" className='notranslate'>Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="bn" className='notranslate'>Bengali (বাংলা)</option>
            <option value="ta" className='notranslate'>Tamil (தமிழ்)</option>
            <option value="te" className='notranslate'>Telugu (తెలుగు)</option>
            <option value="mr" className='notranslate'>Marathi (मराठी)</option>
            <option value="gu" className='notranslate'>Gujarati (ગુજરાતી)</option>
            <option value="kn" className='notranslate'>Kannada (ಕನ್ನಡ)</option>
            <option value="ml" className='notranslate'>Malayalam (മലയാളം)</option>
            <option value="ur" className='notranslate'>Urdu (اردو)</option>
          </select>
        </div>
      </nav>
    </>
  );
}

export default Navbar;