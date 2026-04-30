import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { useMagnetic } from '../../hooks/useMagnetic';

const Navbar = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { ref: magRef, position: magPos, handleMouseMove, handleMouseLeave } = useMagnetic(0.3);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  // Bloquer le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const links = [
    { name: 'Problème', href: '#problem' },
    { name: 'Solution', href: '#solution' },
    { name: 'Portail', href: '#portal' },
    { name: 'Blockchain', href: '#blockchain' },
    { name: 'Impact', href: '#impact' },
    { name: 'Équipe', href: '#equipe' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-surface/90 backdrop-blur-md shadow-sm py-1' : 'bg-transparent py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="IdentiGuinée Logo" 
                className={`h-16 sm:h-24 w-auto transition-all duration-300 group-hover:scale-105 ${
                  !isScrolled && !isMobileMenuOpen ? 'brightness-0 invert' : ''
                }`} 
              />
            </div>
          </a>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-body text-sm font-medium transition-colors hover:text-green ${
                  isScrolled ? 'text-text-muted' : 'text-white/80'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://stitch.withgoogle.com/preview/4670336962817990775?node-id=b9e984092259499dbd4dc34fbfa2b8d1"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2.5 rounded-xl font-body font-bold text-sm transition-all flex items-center gap-2 ${
                isScrolled
                  ? 'bg-green text-white hover:bg-green-dark shadow-md'
                  : 'bg-white text-dark hover:bg-white/90'
              }`}
            >
              Prototype <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            style={{ color: isScrolled || isMobileMenuOpen ? '#1A2E1F' : '#FFFFFF' }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* MOBILE DRAWER — rendu HORS du motion.header pour éviter le bug de stacking context avec CSS transform */}
      <motion.div
        initial={false}
        animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed inset-0 bg-white z-[60] md:hidden flex flex-col pt-24 px-6 gap-6 shadow-2xl"
      >
        {/* Bouton fermeture dans le tiroir */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-5 right-5 p-2 text-dark"
          aria-label="Fermer le menu"
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="flex flex-col gap-6">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display text-2xl font-bold text-dark border-b border-border pb-4"
            >
              {link.name}
            </a>
          ))}
        </nav>
        <div className="mt-8">
          <a
            href="https://stitch.withgoogle.com/preview/4670336962817990775?node-id=b9e984092259499dbd4dc34fbfa2b8d1"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 bg-green text-white px-6 py-4 rounded-xl font-body text-lg font-medium shadow-sm w-full"
          >
            Voir le prototype interactif
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
