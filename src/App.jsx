import { lazy, Suspense } from 'react';
import { useCircuit, CircuitProvider } from './context/CircuitContext';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhyItWorks from './components/WhyItWorks';

import ProgramPathway, { NotAClass } from './components/ProgramPathway';
import FourStudios from './components/FourStudiosDNA';

import Comparison from './components/Comparison';
import Community from './components/Community';
import MakerVoice from './components/MakerVoice';
import ParentPromise from './components/ParentPromise';
import AdmissionsTimeline from './components/AdmissionsTimeline';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import { motion } from 'framer-motion';

// Credibility carries the whole Three.js stack — split it out of the main
// bundle so first paint doesn't pay for a section 15,000px below the fold.
const Credibility = lazy(() => import('./components/Credibility'));

function AppContent() {
  const { isPowered, setIsHeroBridgeComplete } = useCircuit();

  return (
    <>
      <CustomCursor />
      <Navbar />
      <motion.div 
        className="min-h-screen bg-[var(--color-light)] text-[var(--color-text-dark)] selection:bg-[var(--color-accent)] selection:text-white"
        animate={{ 
          filter: isPowered 
            ? 'saturate(1) brightness(1)' 
            : 'saturate(0.15) brightness(0.92)'
        }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
      <main>
        <HeroSection />
        <WhyItWorks />
        <NotAClass />
        <FourStudios />
        <ProgramPathway />
        <Comparison />
        <Suspense fallback={<div className="min-h-[60vh] bg-[var(--color-light)]" />}>
          <Credibility />
        </Suspense>
        <Community />
        <MakerVoice />
        <ParentPromise />
        <AdmissionsTimeline />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyCTA />
    </motion.div>
    </>
  );
}

function App() {
  return (
    <CircuitProvider>
      <AppContent />
    </CircuitProvider>
  );
}

export default App;
