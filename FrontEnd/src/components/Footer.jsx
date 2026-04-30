import React from 'react'

function Footer() {
    const products = ['How it Works', 'Take the Test', 'For Doctors', 'Pricing', 'Blog'];
    const Company = ['About Us', 'Team', 'Research', 'Press', 'Careers']
    const legal = ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Cookie Policy']
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <div className="footer-brand">🧠 Smriti AI</div>
                    <p className="footer-desc">India's first multilingual AI platform for early-stage dementia detection. Built for families, trusted by neurologists.</p>
                </div>
                <div>
                    <div className="footer-col-title">Product</div>
                    <div className="footer-links">
                        {products.map((l, index) => (<span className="footer-link" key={index}>{l}</span>))}
                    </div>
                </div>
                <div>
                    <div className="footer-col-title">Company</div>
                    <div className="footer-links">
                        {Company.map((l, index) => (<span className="footer-link" key={index}>{l}</span>))}
                    </div>
                </div>
                <div>
                    <div className="footer-col-title">Legal</div>
                    <div className="footer-links">
                        {legal.map((l, index) => (<span className="footer-link" key={index}>{l}</span>))}
                    </div>
                </div>
            </div>
            <div className="footer-bottom">© 2026 Smriti AI  · Made with ❤️ in India · Not a replacement for medical diagnosis.</div>
        </footer>

    )
}

export default Footer