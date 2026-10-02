import { CircuitProvider } from './context/CircuitContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhyItWorks from './components/WhyItWorks';

import ProgramPathway from './components/ProgramPathway';
import FourStudios from './components/FourStudiosDNA';

import Comparison from './components/Comparison';
import Team from './components/Team';
import Community from './components/Community';
import ParentPromise from './components/ParentPromise';
import Testimonials from './components/Testimonials';
import AdmissionsTimeline from './components/AdmissionsTimeline';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import MobileCTABar from './components/MobileCTABar';

function AppContent() {
  return (
    <div className="min-h-screen bg-[var(--color-light)] text-[var(--color-text-dark)] selection:bg-[var(--color-accent)] selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <WhyItWorks />
        <ProgramPathway />
        <FourStudios />
        <Comparison />
        <Team />
        <Community />
        <ParentPromise />
        <Testimonials />
        <AdmissionsTimeline />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCTABar />
    </div>
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
