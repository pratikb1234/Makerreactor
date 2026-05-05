import { useCircuit, CircuitProvider } from './context/CircuitContext';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FoundingMakers from './components/FoundingMakers';
import WhyThisExists from './components/WhyThisExists';
import Programs from './components/Programs';
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
  const { isPowered } = useCircuit();

  return (
    <motion.div 
      className="min-h-screen bg-[var(--color-light)] text-[var(--color-text-dark)] selection:bg-[var(--color-accent)] selection:text-white"
      animate={{ 
        filter: isPowered 
          ? 'saturate(1) brightness(1)' 
          : 'saturate(0.15) brightness(0.92)'
      }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <CustomCursor />
      <Navbar />
      <main>
        <HeroSection />
        <FoundingMakers />
        <WhyThisExists />
        <Programs />
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
