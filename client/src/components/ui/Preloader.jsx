import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Preloader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo imposant avec pulsation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.95, 1.05, 0.95], 
            opacity: 1 
          }}
          transition={{ 
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 1, ease: "easeOut" }
          }}
          className="relative z-10 mb-4"
        >
          <img src="/logo.png" alt="IdentiGuinée Logo" className="w-48 sm:w-64 h-auto drop-shadow-2xl" />
        </motion.div>

        {/* Barre de progression épurée */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full bg-green shadow-[0_0_10px_rgba(0,140,68,0.5)]"
            />
          </div>
          <p className="mt-6 text-[10px] font-heading font-bold text-green uppercase tracking-[0.4em] opacity-70">
            Délivrance Sécurisée
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
