import { motion } from 'framer-motion';
import { UserPlus, FileText, Shield, Download, ArrowRight, XCircle, CheckCircle2, User, Building2, GraduationCap, Landmark } from 'lucide-react';
import StepCard from '../ui/StepCard';

const steps = [
  { icon: User, title: "Créer un compte", desc: "Portail web ou application mobile. Inscription en 2 minutes." },
  { icon: FileText, title: "Soumettre la demande", desc: "Formulaire en ligne, upload des pièces justificatives." },
  { icon: Building2, title: "Vérification automatique", desc: "Croisement NaissanceChain. Zéro intervention humaine." },
  { icon: Download, title: "Télécharger le document", desc: "Document certifié, signé cryptographiquement, infalsifiable." },
];

const comparisons = [
  { before: "Délais d'attente de plusieurs semaines", after: "Processus validé en 2 minutes" },
  { before: "Paiements informels obligatoires", after: "Démarche 100% transparente et gratuite" },
  { before: "Documents papier fragiles et perdables", after: "Certificat numérique immuable sur la blockchain" },
  { before: "Risque très élevé de falsification", after: "Signature cryptographique infalsifiable" },
  { before: "Interactions physiques aux guichets", after: "Accessible partout depuis un smartphone" },
];

const TargetCard = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass-card p-6 rounded-2xl flex items-center gap-4 transition-all"
  >
    <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center text-green">
      <Icon className="w-6 h-6" />
    </div>
    <h4 className="font-display font-bold text-text-primary">{title}</h4>
  </motion.div>
);

const Solution = () => {
  return (
    <section className="bg-bg py-24 relative" id="solution">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Titre */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-green/80"></div>
            <span className="text-green font-display font-bold text-xs tracking-[0.2em] uppercase">
              SECTION 03 — LA SOLUTION
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-display font-bold leading-tight max-w-5xl text-text-primary">
            IdentiGuinée automatise tout. <span className="text-green">Zéro agent. Zéro <br className="hidden md:block" /> pot-de-vin.</span>
          </h2>
        </motion.div>

        {/* Flux 4 étapes */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {steps.map((step, i) => (
            <StepCard 
              key={i}
              number={i + 1}
              icon={step.icon}
              title={step.title}
              description={step.desc}
              isLast={i === steps.length - 1}
            />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Tableau Avant/Avec */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-2xl font-bold text-dark mb-8">Le changement structurel</h3>
            <div className="flex flex-col">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-red-light/50 border border-red/30 rounded-xl md:rounded-t-xl md:rounded-b-none p-4 text-center font-display font-bold text-red">
                  Avant <span className="opacity-50 line-through">IdentiGuinée</span>
                </div>
                <div className="hidden md:block bg-green-light/50 border border-green/30 rounded-t-xl p-4 text-center font-display font-bold text-green-dark">
                  Avec IdentiGuinée
                </div>
              </div>

              {comparisons.map((row, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:mb-4">
                  <div className="bg-red-light/30 border border-red/10 rounded-xl p-5 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red shrink-0 mt-0.5" />
                    <p className="font-body text-text-muted text-sm leading-relaxed">{row.before}</p>
                  </div>
                  <div className="bg-green-light/30 border border-green-dark/10 rounded-xl p-5 flex items-start gap-3">
                    <div className="flex items-center gap-2 md:hidden mb-2">
                      <div className="w-2 h-2 rounded-full bg-green"></div>
                      <span className="text-[10px] font-bold text-green uppercase tracking-wider">Solution</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <p className="font-body text-text-primary font-medium text-sm leading-relaxed">{row.after}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Utilisateurs Finaux */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-2xl font-bold text-dark mb-8">Utilisateurs Finaux</h3>
            <div className="grid grid-cols-1 gap-4">
              <TargetCard icon={User} title="Citoyens guinéens demandant des documents" />
              <TargetCard icon={Building2} title="Administrations délivrant des documents" />
              <TargetCard icon={GraduationCap} title="Écoles, hôpitaux et employeurs vérifiant des identités" />
              <TargetCard icon={Landmark} title="Ministère de l'Administration du Territoire" />
            </div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 bg-gold/10 border-l-4 border-gold p-6 rounded-r-xl"
            >
              <p className="font-body text-dark font-medium italic">
                "Ce système ne remplace pas l'État, il lui redonne sa crédibilité en coupant l'accès direct aux fonds illicites à la base."
              </p>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Solution;
