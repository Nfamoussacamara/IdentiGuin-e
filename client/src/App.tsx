import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

// Layouts & UI
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';
import MeshBackground from '@/components/ui/MeshBackground';
import Preloader from '@/components/ui/Preloader';

// Landing Sections
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';
import Portal from '@/components/sections/Portal';
import Blockchain from '@/components/sections/Blockchain';
import Impact from '@/components/sections/Impact';
import Team from '@/components/sections/Team';
import Contact from '@/components/sections/Contact';

// Lazy Loaded Pages (Isolation Strategy)
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));
const Login = lazy(() => import('./pages/Login'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const MyDocuments = lazy(() => import('./pages/dashboard/MyDocuments'));
const NewRequest = lazy(() => import('./pages/dashboard/NewRequest'));
const BlockchainVerify = lazy(() => import('./pages/dashboard/BlockchainVerify'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));

const LandingPage = () => (
  <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-bg">
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

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Toaster position="bottom-right" richColors closeButton />
      <AnimatePresence>
        {loading && <Preloader />}
      </AnimatePresence>

      <Suspense fallback={<div className="h-screen w-screen bg-dashboard-bg flex items-center justify-center font-bold text-dashboard-sidebar">Chargement sécurisé...</div>}>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard - Total Isolation */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="documents" element={<MyDocuments />} />
            <Route path="demandes/nouvelle" element={<NewRequest />} />
            <Route path="verification" element={<BlockchainVerify />} />
            <Route path="profil" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
