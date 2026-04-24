import { useState } from 'react';
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

  const links = [
    { name: 'Problème', href: '#problem' },
    { name: 'Solution', href: '#solution' },
    { name: 'Portail', href: '#portal' },
    { name: 'Blockchain', href: '#blockchain' },
    { name: 'Impact', href: '#impact' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-surface/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <a href="#" className="flex items-center gap-2 z-50">
          <Shield className="w-8 h-8 text-green" strokeWidth={2.5} />
          <span className={`font-display font-bold text-xl tracking-tight transition-colors duration-300 ${
            isScrolled ? 'text-dark' : 'text-white'
          }`}>
            IdentiGuinée
          </span>
        </a>

        {/* DESKTOP LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`font-body text-sm font-medium transition-colors duration-300 ${
                isScrolled ? 'text-text-muted hover:text-green' : 'text-white/70 hover:text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* DESKTOP CTA */}
        <div className="hidden md:flex items-center">
          <motion.a
            ref={magRef}
            animate={{ x: magPos.x, y: magPos.y }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            href="https://stitch.withgoogle.com/preview/4670336962817990775?node-id=b9e984092259499dbd4dc34fbfa2b8d1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green hover:bg-green-dark text-white px-5 py-2.5 rounded-lg font-body text-sm font-bold transition-shadow shadow-lg shadow-green/20 group"
          >
            Prototype
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className={`md:hidden z-50 transition-colors duration-300 ${
            isScrolled || isMobileMenuOpen ? 'text-dark' : 'text-white'
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>


        {/* MOBILE SLIDE DRAWER */}
        <motion.div
          initial={false}
          animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="fixed inset-0 bg-surface z-40 md:hidden flex flex-col pt-24 px-6 gap-6"
        >
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
      </div>
    </motion.header>
  );
};

export default Navbar;
