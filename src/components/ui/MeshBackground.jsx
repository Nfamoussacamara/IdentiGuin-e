import { motion } from 'framer-motion';

const MeshBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-bg">
      {/* Orb Verte (Haut Gauche) */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-green/10 blur-[120px]"
      />

      {/* Orb Or (Bas Droite) */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gold/5 blur-[120px]"
      />

      {/* Orb Rouge (Milieu) */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-danger/5 blur-[150px]"
      />

      {/* Texture Grain (Noise) - On renforce ici pour le Mesh */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
    </div>
  );
};

export default MeshBackground;
