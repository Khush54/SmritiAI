import React from 'react'
import { useState } from 'react';
import Navbar from '../components/Navbar'
import Hero from '../components/Hero';
import Feature from '../components/Feature';
import Stats from '../components/Stats';
import Process from '../components/Process';
import Cta from '../components/Cta';
import Footer from '../components/Footer';

function LandingPage({setPage}) {

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