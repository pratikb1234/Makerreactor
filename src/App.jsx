import { useCircuit, CircuitProvider } from './context/CircuitContext';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhyItWorks from './components/WhyItWorks';

import ProgramPathway, { NotAClass } from './components/ProgramPathway';
import FourStudios from './components/FourStudiosDNA';

import Comparison from './components/Comparison';
import Credibility from './components/Credibility';
import Community from './components/Community';
import ParentPromise from './components/ParentPromise';
import AdmissionsTimeline from './components/AdmissionsTimeline';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import { motion } from 'framer-motion';


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
        <Credibility />
        <Community />
        <ParentPromise />
        <AdmissionsTimeline />
        <FinalCTA />
      </main>
      <Footer />
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
