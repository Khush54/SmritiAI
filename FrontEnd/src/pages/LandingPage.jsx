import React from 'react'
import { useState } from 'react';
import Navbar from '../components/Landing/Navbar'
import Hero from '../components/Landing/Hero'
import Feature from '../components/Landing/Feature'
import Stats from '../components/Landing/Stats'
import Process from '../components/Landing/Process'
import Cta from '../components/Landing/Cta'
import Footer from '../components/Landing/Footer'

import { useNavigate } from 'react-router-dom';

function LandingPage({ darkMode, toggleDark }) {
    const navigate = useNavigate();
    const setPage = (pageStr) => {
        if (pageStr === 'landing') navigate('/');
        else navigate(`/${pageStr}`);
    };

    return (
        <>
            <Navbar
                setPage={setPage}
            />
            <Hero
                setPage={setPage}
            />
            <Feature />
            <Stats />
            <Process />
            <Cta setPage={setPage} />
            <Footer />
        </>
    )
}

export default LandingPage