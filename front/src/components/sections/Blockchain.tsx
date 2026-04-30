import React from 'react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: 'Transparent',
    desc: 'Chaque action est enregistrée de façon immuable sur la blockchain. Auditable par tous, en temps réel.',
    detail: 'Aucun agent ne peut modifier un enregistrement sans que la modification soit visible par tous.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
        <path d="M9 9l2 2 4-4"/>
      </svg>
    ),
    title: 'Automatisé',
    desc: "Les smart contracts s'exécutent automatiquement. Zéro décision humaine discrétionnaire dans le processus.",
    detail: 'Le contrat intelligent vérifie les données, génère le document et le signe sans aucune intervention.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Infalsifiable',
    desc: "La signature cryptographique garantit l'authenticité. Vérifiable en 3 secondes par n'importe quelle administration.",
    detail: 'Il est mathématiquement impossible de falsifier un document signé par la clé privée NaissanceChain.',
  },
];

const flowNodes = [
  { label: 'Citoyen', sublabel: 'Demande en ligne', emoji: '👤', color: 'bg-white/10 border-white/20' },
  { label: 'Portail IdentiGuinée', sublabel: 'Validation formulaire', emoji: '🌐', color: 'bg-primary/10 border-primary/30' },
  { label: 'Smart Contract', sublabel: 'Exécution automatique', emoji: '⚡', color: 'bg-accent/10 border-accent/30' },
  { label: 'NaissanceChain', sublabel: 'Vérification croisée', emoji: '🔗', color: 'bg-white/5 border-white/10' },
  { label: 'Signature', sublabel: 'Cryptographique', emoji: '🔐', color: 'bg-primary/10 border-primary/30' },
  { label: 'Document certifié', sublabel: '+ QR code', emoji: '📜', color: 'bg-accent/10 border-accent/30' },
];

const Blockchain = () => {
  return (
    <section id="blockchain" className="py-20 text-white" style={{ backgroundColor: '#0D1B12' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-primary"></span>
            <span className="text-xs font-semibold font-heading text-primary uppercase tracking-widest">
              Section 05 — Pourquoi la Blockchain
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            La blockchain rend la corruption{' '}
            <span className="text-primary">techniquement impossible</span>
          </h2>
        </div>

        {/* 3 Benefits */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.007, y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="rounded-2xl p-6 glass-card-dark transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-5">
                {b.icon}
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-3">{b.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4">{b.desc}</p>
              <p className="text-xs text-white/40 leading-relaxed border-t border-white/10 pt-3">{b.detail}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* NaissanceChain Flow */}
        <div className="mb-12">
          <h3 className="font-heading font-bold text-xl text-white mb-2 text-center">Flux NaissanceChain</h3>
          <p className="text-sm text-white/50 text-center mb-8">Comment un document est généré automatiquement</p>

          <div className="rounded-2xl p-6 sm:p-8 border border-white/10 overflow-hidden" style={{ backgroundColor: '#163122' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 mx-auto">
              {flowNodes.map((node, i) => (
                <React.Fragment key={node.label}>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 flex flex-col items-center"
                  >
                    <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl ${node.color}`}>
                      {node.emoji}
                    </div>
                    <p className="text-xs font-bold font-heading text-center mt-2 text-white max-w-[80px]">
                      {node.label}
                    </p>
                    <p className="text-xs text-white/40 text-center max-w-[80px]">{node.sublabel}</p>
                  </motion.div>
                  {i < flowNodes.length - 1 && (
                    <div className="flex-shrink-0 sm:flex hidden items-center">
                      <svg width="32" height="16" viewBox="0 0 32 16">
                        <defs>
                          <linearGradient id={`arrow-grad-${i}`} x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#008C44"/>
                            <stop offset="100%" stopColor="#BFA15F"/>
                          </linearGradient>
                        </defs>
                        <line 
                          x1="0" y1="8" x2="28" y2="8" 
                          stroke={`url(#arrow-grad-${i})`} 
                          strokeWidth="2" 
                          strokeDasharray="4 4"
                          className="animate-flow-horizontal"
                        />
                        <path d="M24 4 L32 8 L24 12" fill="none" stroke="#BFA15F" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {i < flowNodes.length - 1 && (
                    <div className="sm:hidden flex flex-col items-center py-2">
                      <svg width="16" height="32" viewBox="0 0 16 32">
                        <defs>
                          <linearGradient id={`arrow-grad-mob-${i}`} x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#008C44"/>
                            <stop offset="100%" stopColor="#BFA15F"/>
                          </linearGradient>
                        </defs>
                        <line 
                          x1="8" y1="0" x2="8" y2="28" 
                          stroke={`url(#arrow-grad-mob-${i})`} 
                          strokeWidth="2" 
                          strokeDasharray="4 4"
                          className="animate-flow-vertical"
                        />
                        <path d="M4 24 L8 32 L12 24" fill="none" stroke="#BFA15F" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Hash */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-semibold text-primary font-heading">Enregistré sur NaissanceChain</span>
              </div>
              <div className="font-mono text-sm text-white/60 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                Hash : 0x3f9a8c2b1e...d42c
              </div>
            </div>
          </div>
        </div>

        {/* Why not a DB */}
        <div>
          <div className="bg-white/5 rounded-2xl border border-accent/20 overflow-hidden">
            <div className="px-6 py-4 bg-accent/10 border-b border-accent/20 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BFA15F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3 className="font-heading font-bold text-accent text-lg">
                Pourquoi pas une simple base de données ?
              </h3>
            </div>
            <div className="p-6">
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.007, y: -2 }}
                  className="rounded-xl p-5 glass-card-dark transition-all" 
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-lg flex-shrink-0">🗄️</span>
                    <h4 className="font-heading font-bold text-sm leading-snug" style={{ color: '#CE1126' }}>Base de données classique</h4>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Une base de données peut être <strong style={{ color: '#CE1126' }}>modifiée discrètement</strong> par un administrateur système. Un agent corruptible peut altérer les enregistrements sans laisser de trace visible.
                  </p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.007, y: -2 }}
                  className="rounded-xl p-5 glass-card-dark transition-all" 
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-lg flex-shrink-0">⚡</span>
                    <h4 className="font-heading font-bold text-sm leading-snug" style={{ color: '#FCD116' }}>Smart Contract blockchain</h4>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Un smart contract <strong style={{ color: '#FCD116' }}>s'exécute automatiquement</strong>, sans possibilité d'intervention humaine. Aucun agent ne peut interrompre ou modifier l'exécution du contrat.
                  </p>
                </motion.div>
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.007, y: -2 }}
                  className="rounded-xl p-5 glass-card-dark transition-all" 
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-lg flex-shrink-0">🔍</span>
                    <h4 className="font-heading font-bold text-sm leading-snug" style={{ color: '#009A44' }}>Auditabilité publique</h4>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    La blockchain est <strong style={{ color: '#009A44' }}>auditée publiquement</strong>, pas par un seul agent corruptible. Chaque transaction est visible et vérifiable par n'importe qui, à tout moment.
                  </p>
                </motion.div>
              </motion.div>
              <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20 text-center">
                <p className="text-sm font-semibold font-heading text-white">
                  Conclusion : La blockchain ne rend pas la corruption <em>difficile</em> — elle la rend{' '}
                  <span className="text-primary">techniquement impossible.</span>
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <a 
                  href="/composante_blockchain_identiguinee.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 text-white border border-white/10 rounded-2xl text-xs font-bold font-heading hover:bg-white/10 hover:border-primary/50 transition-all group shadow-xl"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-[-2px] transition-transform text-primary">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M12 18V12"/>
                    <path d="M9 15L12 12L15 15"/>
                  </svg>
                  LIRE LA COMPOSANTE BLOCKCHAIN (PDF)
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Blockchain;
