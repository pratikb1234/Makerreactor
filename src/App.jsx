import { useCircuit, CircuitProvider } from './context/CircuitContext';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhyItWorks from './components/WhyItWorks';
import WhyThisExists from './components/WhyThisExists';
import ProgramPathway from './components/ProgramPathway';
import ExperienceTrial from './components/ExperienceTrial';
import Comparison from './components/Comparison';
import Credibility from './components/Credibility';
import Community from './components/Community';
import ParentPromise from './components/ParentPromise';
import Testimonials from './components/Testimonials';
import AdmissionsTimeline from './components/AdmissionsTimeline';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import { motion } from 'framer-motion';

function AppContent() {
  const { isPowered, setIsHeroBridgeComplete } = useCircuit();

  return (
    <>
      <CustomCursor />
      <motion.div 
        className="min-h-screen bg-[var(--color-light)] text-[var(--color-text-dark)] selection:bg-[var(--color-accent)] selection:text-white"
        animate={{ 
          filter: isPowered 
            ? 'saturate(1) brightness(1)' 
            : 'saturate(0.15) brightness(0.92)'
        }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
      <Navbar />
      <main>
        <HeroSection />
        <WhyItWorks />
        <ProgramPathway />
        <WhyThisExists />
        <ExperienceTrial />
        <Comparison />
        <Credibility />
        <Community />
        <ParentPromise />
        <Testimonials />
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
