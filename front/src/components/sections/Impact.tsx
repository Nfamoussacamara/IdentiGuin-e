import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

function AnimatedCounter({ target, suffix = '', isPrefix = false }: { target: number, suffix?: string, isPrefix?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
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

export default function Impact() {
  const [animateNumbers, setAnimateNumbers] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimateNumbers(true);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="impact" ref={sectionRef} className="py-24 bg-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-14 reveal-on-scroll">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-primary"></span>
            <span className="text-xs font-semibold font-heading text-primary uppercase tracking-widest">Section 06 — Impact Attendu</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight">
            Ce que IdentiGuinée change{' '}
            <span className="text-primary">pour les Guinéens</span>
          </h2>
        </div>

        {/* ODD Cards */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {/* ODD 10 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.007, y: -8 }}
            className="glass-card rounded-2xl p-8 cursor-default"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-white text-xl">10</span>
              </div>
              <div>
                <p className="text-xs font-bold font-heading text-primary uppercase tracking-wider mb-1">Objectif 10</p>
                <h3 className="font-heading font-bold text-lg text-text-primary leading-tight">Réduction des inégalités</h3>
              </div>
            </div>
            <p className="text-base text-text-muted leading-relaxed mb-6">
              <strong className="text-text-primary font-bold">Les citoyens les plus pauvres accèdent enfin aux documents auxquels ils ont droit</strong>, sans payer de pot-de-vin. L'automatisation supprime la barrière économique de la corruption.
            </p>
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#199756" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="text-xs font-semibold font-heading text-primary">Impact direct</span>
              </div>
              <p className="text-xs text-text-muted">Fini le cercle vicieux : pas d'argent pour le pot-de-vin → pas de document → pas d'accès aux services → encore plus de pauvreté.</p>
            </div>
          </motion.div>

          {/* ODD 16 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.007, y: -8 }}
            className="glass-card rounded-2xl p-8 cursor-default"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-dark text-xl">16</span>
              </div>
              <div>
                <p className="text-xs font-bold font-heading text-accent uppercase tracking-wider mb-1">Objectif 16</p>
                <h3 className="font-heading font-bold text-lg text-text-primary leading-tight">Institutions efficaces et transparentes</h3>
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              <strong className="text-text-primary font-bold">La confiance dans les institutions publiques augmente.</strong> La corruption dans l'état civil recule structurellement, car le système la rend techniquement impossible.
            </p>
            <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BFA15F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="text-xs font-semibold font-heading text-accent">Impact systémique</span>
              </div>
              <p className="text-xs text-text-muted">La transparence blockchain crée une auditabilité publique. Chaque transaction est visible. La corruption n'a plus de place où se cacher.</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Big Impact Statement */}
        <div className="mb-16 reveal-on-scroll">
          <div className="rounded-[2rem] p-10 sm:p-16 text-center relative overflow-hidden bg-green">
            {/* Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("/kente-pattern.svg")', backgroundSize: '150px' }}></div>
            
            <p className="text-xs font-semibold font-heading text-white uppercase tracking-widest mb-10 relative z-10">L'impact en chiffres</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 relative z-10">
              <div className="text-center">
                <p className="font-heading font-bold text-5xl sm:text-7xl text-white">
                  <AnimatedCounter target={0} suffix="" />
                </p>
                <p className="text-sm font-semibold font-heading text-white/80 mt-3 uppercase tracking-wider">Pot-de-vin</p>
              </div>
              <div className="hidden sm:block w-px h-20 bg-white/10"></div>
              <div className="text-center">
                <p className="font-heading font-bold text-5xl sm:text-7xl text-white">
                  <AnimatedCounter target={2} suffix="" /><span className="text-3xl sm:text-4xl">min</span>
                </p>
                <p className="text-sm font-semibold font-heading text-white/80 mt-3 uppercase tracking-wider">Délai d'obtention</p>
              </div>
              <div className="hidden sm:block w-px h-20 bg-white/10"></div>
              <div className="text-center">
                <p className="font-heading font-bold text-5xl sm:text-7xl text-white">
                  <AnimatedCounter target={100} suffix="" /><span className="text-3xl sm:text-4xl">%</span>
                </p>
                <p className="text-sm font-semibold font-heading text-white/80 mt-3 uppercase tracking-wider">Auditabilité</p>
              </div>
            </div>
          </div>
        </div>

        {/* Citation & Meta */}
        <div className="reveal-on-scroll max-w-4xl">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mb-6 opacity-20 text-green">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <p className="font-heading text-xl sm:text-2xl text-text-primary leading-relaxed mb-6 italic">
            "Un système de délivrance automatique supprime les opportunités de corruption."
          </p>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-6 h-px bg-primary"></div>
            <cite className="text-sm font-bold font-heading text-text-muted not-italic uppercase tracking-wider">
              Cahier des charges MIABE Hackathon 2026
            </cite>
          </div>

          {/* Project metadata */}
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-surface border border-border rounded-full text-xs font-bold font-heading text-text-muted uppercase">
              Projet GN-02
            </span>
            <span className="px-4 py-2 bg-surface border border-border rounded-full text-xs font-bold font-heading text-text-muted uppercase">
              Catégorie D06
            </span>
            <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold font-heading text-primary uppercase">
              MIABE Hackathon 2026
            </span>
            <span className="px-4 py-2 bg-surface border border-border rounded-full text-xs font-bold font-heading text-text-muted uppercase">
              Darollo Technologies Corporation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
