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
      <div className="relative">
        {/* Anneau de chargement */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-t-2 border-b-2 border-green rounded-full opacity-20"
        />
        
        {/* Shield Icon central */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Shield className="w-10 h-10 text-green" strokeWidth={2} />
        </motion.div>
      </div>

      {/* Texte IdentiGuinée */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 flex flex-col items-center"
      >
        <h1 className="text-2xl font-display font-bold text-dark tracking-tight">
          Identi<span className="text-green">Guinée</span>
        </h1>
        <div className="mt-2 w-32 h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full bg-green"
          />
        </div>
        <p className="mt-4 text-xs font-heading font-semibold text-text-muted uppercase tracking-[0.2em]">
          Délivrance Sécurisée
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Preloader;
