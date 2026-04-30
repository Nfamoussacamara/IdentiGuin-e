import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform, useMotionValue, animate } from 'framer-motion';

const statCards = [
  {
    value: '150/180',
    numericValue: 150,
    suffix: '/180',
    label: 'Rang corruption TI 2023',
    borderColor: 'border-danger',
    textColor: 'text-danger',
    source: 'Transparency International 2023',
  },
  {
    value: '70%',
    numericValue: 70,
    suffix: '%',
    label: 'Guinéens victimes de paiements informels',
    borderColor: 'border-accent',
    textColor: 'text-text-primary',
    source: 'TI Guinée, 2022',
  },
  {
    value: '< 25%',
    numericValue: 25,
    suffix: '%',
    label: 'Communes avec système informatique',
    borderColor: 'border-danger',
    textColor: 'text-danger',
    source: 'Cahier des charges MIABE 2026',
  },
  {
    value: '500 000 GNF',
    numericValue: 500000,
    suffix: ' GNF',
    label: "Prix d'un faux passeport",
    borderColor: 'border-accent',
    textColor: 'text-text-primary',
    source: 'Marché informel documenté',
  },
];

const timelineSteps = [
  {
    step: '01',
    title: 'Il se déplace au bureau d\'état civil',
    desc: 'Le citoyen prend une demi-journée de travail pour se rendre physiquement au bureau, souvent loin de chez lui.',
  },
  {
    step: '02',
    title: 'Il attend des heures sans résultat',
    desc: 'Longues files d\'attente, dossiers perdus, renvois systématiques. La procédure est volontairement opaque.',
  },
  {
    step: '03',
    title: 'Un agent lui demande un paiement informel',
    desc: 'Entre 200 000 et 500 000 GNF sont exigés officieusement pour "accélérer" la démarche.',
  },
  {
    step: '04',
    title: 'S\'il refuse de payer, il repart sans document',
    desc: 'Les citoyens les plus pauvres, incapables de payer, sont exclus de leurs droits fondamentaux.',
  },
];

interface CounterProps {
  target: number;
  suffix?: string;
  isPrefix?: boolean;
}

function AnimatedCounter({ target, suffix = '', isPrefix = false }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const val = Math.floor(latest);
    return target >= 1000 ? val.toLocaleString('fr-FR') : val.toString();
  });

  useEffect(() => {
    if (isInView) {
      // Animation experte via MotionValue : ultra fluide et performante
      const controls = animate(count, target, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1], // easeOutQuart premium
      });
      return () => controls.stop();
    }
  }, [isInView, target, count]);

  return (
    <span ref={ref}>
      {isPrefix && '< '}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function Problem() {
  return (
    <section id="probleme" className="py-24 relative overflow-hidden" style={{ backgroundColor: '#f5faf6' }}>
      {/* Texture */}


      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="mb-16 reveal-on-scroll">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-danger"></span>
            <span className="text-xs font-semibold font-heading text-danger uppercase tracking-widest">Section 02 — Le Problème</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight max-w-4xl">
            Obtenir un document d'identité en Guinée :{' '}
            <span className="text-danger">un parcours semé de corruption</span>
          </h2>
        </div>

        {/* Stat Cards Grid */}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.007, y: -4 }}
              className={`stat-card reveal-on-scroll glass-card rounded-2xl p-6 border ${card.borderColor} flex flex-col h-full transition-colors cursor-default`}
            >
              <div className={`font-heading font-bold text-xl sm:text-2xl ${card.textColor} mb-3 leading-none whitespace-nowrap`}>
                {card.value.includes('/') ? (
                  <span>
                    <AnimatedCounter target={card.numericValue} suffix="" />/180
                  </span>
                ) : card.value.startsWith('<') ? (
                  <span>
                    <AnimatedCounter target={card.numericValue} suffix={card.suffix} isPrefix={true} />
                  </span>
                ) : card.value.includes('GNF') ? (
                  <span>
                    <AnimatedCounter target={card.numericValue} suffix=" GNF" />
                  </span>
                ) : (
                  <AnimatedCounter target={card.numericValue} suffix={card.suffix} />
                )}
              </div>
              <p className="text-sm font-bold text-text-primary mb-3 leading-snug">{card.label}</p>
              <p className="text-xs text-text-muted font-mono mt-auto">{card.source}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Two-column: Timeline + Consequences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Timeline */}
          <div className="reveal-on-scroll">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-danger/20">
                <img src={encodeURI("/Guinée tech lab/profil.jpeg")} alt="Citizen" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-heading font-bold text-xl text-text-primary">
                Parcours d'un citoyen aujourd'hui
              </h3>
            </div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
              className="space-y-4"
            >
              {timelineSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 }
                  }}
                  className="relative pl-12 pb-4"
                >
                  {/* Ligne connectrice */}
                  {i !== timelineSteps.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-[-16px] w-0.5 bg-border"></div>
                  )}
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-surface border-2 border-danger flex items-center justify-center flex-shrink-0 z-10">
                    <span className="text-xs font-bold font-heading text-danger">{step.step}</span>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.007, x: 4 }}
                    className="glass-card rounded-xl p-5 transition-all cursor-default"
                  >
                    <h4 className="font-heading font-bold text-sm text-text-primary mb-2">{step.title}</h4>
                    <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Consequences + Context */}
          <div className="reveal-on-scroll delay-200">
            <motion.div
              whileHover={{ scale: 1.005, y: -2 }}
              className="bg-surface rounded-2xl p-8 border border-border mb-6 relative overflow-hidden transition-all cursor-default"
            >

              <h3 className="font-heading font-bold text-lg text-text-primary mb-6 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CE1126" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Conséquences documentées
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-danger/10 text-danger border border-danger/20 rounded-full text-xs font-bold font-heading">
                  Fraude électorale
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-danger/10 text-danger border border-danger/20 rounded-full text-xs font-bold font-heading">
                  Trafic d'identité
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-danger text-white rounded-full text-xs font-bold font-heading">
                  Exclusion des vulnérables
                </span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                Les pratiques corrompues excluent les citoyens les plus pauvres, incapables de payer, de leurs droits fondamentaux. La corruption dans l'état civil n'est pas individuelle — elle est <strong className="text-text-primary font-bold">structurelle</strong>.
              </p>
            </motion.div>

            {/* Sources */}
            <div className="bg-surface rounded-xl p-6 border border-border">
              <p className="text-xs font-bold font-heading text-text-muted uppercase tracking-wider mb-4">Sources et données</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-text-muted leading-relaxed"><strong className="text-text-primary font-bold">Transparency International 2023</strong> — Indice de Perception de la Corruption, rang 150/180</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-text-muted leading-relaxed"><strong className="text-text-primary font-bold">TI Guinée, 2022</strong> — 60 à 70% des citoyens ayant versé un paiement informel</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-text-muted leading-relaxed"><strong className="text-text-primary font-bold">Cahier des charges MIABE 2026</strong> — moins de 25% des communes informatisées</p>
                </div>
                
                <div className="mt-5 pt-5 border-t border-border">
                  <a 
                    href="/rapport_corruption_guinee_v2.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-danger/10 text-danger border border-danger/20 rounded-xl text-[11px] font-bold font-heading hover:bg-danger/20 transition-all group w-full justify-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    CONSULTER L'ANALYSE COMPLÈTE (PDF)
                  </a>
                </div>
              </div>
            </div>

            {/* Key insight */}
            <div className="mt-8 p-6 bg-dark rounded-2xl text-white relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-danger/20 rounded-full blur-2xl"></div>
              <p className="text-sm leading-relaxed relative z-10">
                <span className="text-danger font-bold font-heading text-base block mb-2">Le principe est simple :</span>
                Plus la procédure est opaque et manuelle, plus elle crée d'opportunités de corruption. La solution doit rendre la délivrance de documents d'identité aussi <strong className="text-white font-bold">automatique, transparente et sans intermédiaire</strong> que possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
