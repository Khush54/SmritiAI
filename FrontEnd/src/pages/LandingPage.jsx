import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Landing/Navbar'
import Hero from '../components/Landing/Hero'
import TrustBadges from '../components/Landing/TrustBadges'
import Feature from '../components/Landing/Feature'
import Stats from '../components/Landing/Stats'
import Process from '../components/Landing/Process'
import Testimonials from '../components/Landing/Testimonials'
import FAQ from '../components/Landing/FAQ'
import Cta from '../components/Landing/Cta'
import Footer from '../components/Landing/Footer'

function LandingPage() {
    const navigate = useNavigate();
    const setPage = (pageStr) => {
        if (pageStr === 'landing') navigate('/');
        else navigate(`/${pageStr}`);
    };

    return (
        <>
            <Navbar setPage={setPage} />
            <Hero setPage={setPage} />
            <TrustBadges />
            <Feature />
            <Stats />
            <Process />
            <Testimonials />
            <FAQ />
            <Cta setPage={setPage} />
            <Footer />
        </>
    )
}

export default LandingPage
