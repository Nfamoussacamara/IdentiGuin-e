import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Problem from './components/sections/Problem';
import Solution from './components/sections/Solution';
import Portal from './components/sections/Portal';
import Blockchain from './components/sections/Blockchain';
import Impact from './components/sections/Impact';
import Team from './components/sections/Team';
import Contact from './components/sections/Contact';
import BackToTop from './components/ui/BackToTop';
import MeshBackground from './components/ui/MeshBackground';
import Preloader from './components/ui/Preloader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'un chargement premium
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <AnimatePresence>
        {loading && <Preloader />}
      </AnimatePresence>

      <MeshBackground />
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <Problem />
        <Solution />
        <Portal />
        <Blockchain />
        <Impact />
        <Team />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
