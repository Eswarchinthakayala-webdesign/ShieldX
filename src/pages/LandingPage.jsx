import React, { useEffect } from 'react';
import Hero from '../components/landing-page/Hero';
import HowItWorks from '../components/landing-page/HowItWorks';
import SecurityFeatures from '../components/landing-page/SecurityFeatures';
import Architecture from '../components/landing-page/Architecture';
import CTA from '../components/landing-page/CTA';

const LandingPage = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative">
      <Hero />
      
      <div className="space-y-32">
        <HowItWorks />
        <SecurityFeatures />
        <Architecture />
        <CTA />
      </div>
    </div>
  );
};

export default LandingPage;