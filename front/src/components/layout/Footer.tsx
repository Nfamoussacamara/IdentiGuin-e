import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative pt-16 pb-8 overflow-hidden bg-green">
      {/* Motif Kente en overlay */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'url("/kente-pattern.svg")', backgroundSize: '100px' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Gauche : Logo + tagline + badges ODD */}
          <div className="flex flex-col gap-6">
            <a href="#" className="flex items-center gap-2 group">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="IdentiGuinée Logo" 
                  className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105 brightness-0 invert" 
                />
              </div>
            </a>
            <p className="font-body text-white/70 text-sm max-w-xs">
              La plateforme d'état civil nouvelle génération. Zéro corruption. Zéro intermédiaire. 100% automatisée.
            </p>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full font-display tracking-wide border border-gold/30">
                Objectif 10
              </span>
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full font-display tracking-wide border border-white/30">
                Objectif 16
              </span>
            </div>
          </div>

          {/* Centre : Infos Hackathon */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold text-white mb-2">MIABE Hackathon 2026</h4>
            <ul className="flex flex-col gap-2 font-body text-sm text-white/70">
              <li>Projet GN-02</li>
              <li>Catégorie D06</li>
              <li>Thème : "La Blockchain, levier du développement durable africain"</li>
              <li><span className="text-white">Darollo Technologies Corporation</span></li>
              <li><a href="https://www.miabehackathon.com" className="hover:text-gold transition-colors" target="_blank" rel="noreferrer">www.miabehackathon.com</a></li>
            </ul>
          </div>

          {/* Droite : Ministère & CTA */}
          <div className="flex flex-col gap-4 md:items-end md:text-right">
            <h4 className="font-display font-bold text-white mb-2">Partenaires institutionnels</h4>
            <p className="font-body text-sm text-white/70 md:max-w-[200px]">
              Ministère de l'Administration du Territoire et de la Décentralisation de la République de Guinée.
            </p>
            <a
              href="#"
              className="mt-4 inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-dark border border-white/30 px-4 py-2 rounded-lg font-body text-sm font-medium transition-colors"
            >
              Prototype interactif →
            </a>
          </div>

        </div>

        {/* Séparateur */}
        <hr className="border-white/20 mb-8" />
        
        <div className="flex justify-between items-center text-xs text-white/50 font-body">
          <p>© {new Date().getFullYear()} IdentiGuinée. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
