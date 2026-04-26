import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, ShieldCheck, FileWarning } from 'lucide-react';

const screens = [
  { id: "01", title: "Landing", desc: "Accès public, aucun intermédiaire requis", img: "/1.png" },
  { id: "02", title: "Formulaire", desc: "4 types de documents · Upload pièces", img: "/2.png" },
  { id: "03", title: "Suivi de statut", desc: "NaissanceChain live · Réf REQ-2026-00847", img: "/3.png" },
  { id: "04", title: "Document certifié", desc: "Armoiries · QR code · PDF signé", img: "/4.png" },
];

const ScreenCard = ({ id, title, desc, img }: { id: string, title: string, desc: string, img: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, scale: 0.95, y: 20 },
      show: { opacity: 1, scale: 1, y: 0 }
    }}
    transition={{ duration: 0.5 }}
    whileHover={{ translateY: -4 }}
    className="group glass-card rounded-2xl p-4 flex flex-col gap-4 transition-all cursor-pointer"
  >
    <div className="aspect-[4/3] bg-green-light rounded-xl border border-border flex items-center justify-center overflow-hidden relative">
      <img src={img} alt={`Écran ${id}`} className="w-full h-full object-cover object-top" />
    </div>
    <div className="flex items-start gap-3 px-2">
      <span className="bg-green text-white text-xs font-display font-bold px-2 py-1 rounded w-fit mt-1">
        {id}
      </span>
      <div>
        <h4 className="text-dark font-display font-semibold text-base">{title}</h4>
        <p className="text-text-muted font-body text-sm">{desc}</p>
      </div>
    </div>
  </motion.div>
);

const Portal = () => {
  return (
    <section className="bg-bg py-24 relative overflow-hidden border-t border-border" id="portal">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-green"></span>
            <span className="text-xs font-semibold font-display text-green uppercase tracking-widest">Le Portail</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-dark">
            Le portail <span className="text-green">IdentiGuinée</span> en images
          </h2>
        </motion.div>

        {/* A — Espace Citoyen */}
        <div className="mb-24">
          <h3 className="text-xl font-display font-bold text-dark mb-8 border-b border-border pb-4">
            A — Espace Citoyen
          </h3>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {screens.map((s, i) => <ScreenCard key={i} {...s} />)}
          </motion.div>
        </div>

        {/* B — Vérification Tiers */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-border pb-4 gap-4">
            <h3 className="text-xl font-display font-bold text-dark m-0">
              B — Vérification Tiers
            </h3>
            <p className="text-sm font-body text-green-dark font-semibold m-0 flex items-center gap-2 bg-green-light px-4 py-2 rounded-full border border-green/20">
              <ShieldCheck className="w-4 h-4" />
              Vérifiable en 3s par toute administration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-green-light border border-green/20 rounded-2xl overflow-hidden flex flex-col cursor-pointer"
            >
              <img src="/auth.png" alt="Document authentique" className="w-full h-48 object-cover object-top" />
              <div className="p-6 md:p-8 flex items-start gap-4">
                <div className="bg-green text-white p-2 rounded-full mt-1">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-dark font-display font-bold text-xl mb-2 flex items-center gap-2">
                    Document Authentique
                    <span className="text-[10px] bg-green text-white px-2 py-1 rounded-full uppercase tracking-wider">Validé</span>
                  </h4>
                  <div className="font-mono text-sm text-text-muted flex flex-col gap-1">
                    <span>ID: GN-2026-984A-B72C</span>
                    <span>Délivré le: 15 Mars 2026</span>
                    <span>Signature: 0x8f2...1c4</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-red-light border border-red/20 rounded-2xl overflow-hidden flex flex-col cursor-pointer"
            >
              <img src="/false.png" alt="Document invalide" className="w-full h-48 object-cover object-top" />
              <div className="p-6 md:p-8 flex items-start gap-4">
                <div className="bg-red text-white p-2 rounded-full mt-1">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-dark font-display font-bold text-xl mb-2 flex items-center gap-2">
                    Document Invalide
                    <span className="text-[10px] bg-red text-white px-2 py-1 rounded-full uppercase tracking-wider">Rejeté</span>
                  </h4>
                  <div className="font-mono text-sm text-text-muted flex flex-col gap-1">
                    <span className="flex items-center gap-2"><FileWarning className="w-4 h-4 text-red" /> Signature non reconnue</span>
                    <span>Raison: Hash mismatch (falsification possible)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* C — Administration */}
        <div>
          <h3 className="text-xl font-display font-bold text-dark mb-8 border-b border-border pb-4">
            C — Administration
          </h3>

          {/* Image Card avec hover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ translateY: -4 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl flex flex-col transition-all cursor-pointer mb-10 overflow-hidden"
          >
            <div className="bg-[#f0f4f1] rounded-xl p-6">
              <img src="/admin2.png" alt="Dashboard Administrateur" className="w-full h-auto object-contain rounded-lg" />
            </div>
          </motion.div>

          {/* KPI Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8"
          >
            <div className="bg-green-light/30 border border-green/10 text-text-primary px-10 py-5 rounded-2xl font-display font-bold text-lg flex items-center gap-6">
              <div className="bg-white p-2 rounded-lg">
                <ShieldCheck className="text-green w-6 h-6" />
              </div>
              <p className="leading-tight">
                <span className="text-green text-2xl">0</span> interventions manuelles <span className="text-text-muted font-normal mx-2">=</span> <span className="text-green text-2xl">0</span> corruption possible
              </p>
            </div>
          </motion.div>

          {/* Métriques */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-x-4 gap-y-6 sm:gap-8 text-text-muted font-mono text-xs sm:text-sm mb-10 border-t border-border pt-8"
          >
            <div className="flex flex-col items-center">
              <span className="text-text-primary text-2xl sm:text-3xl font-bold font-display">247</span>
              <span className="text-[10px] sm:text-sm text-center">Demandes/jour</span>
            </div>
            <div className="hidden xs:block w-px h-8 sm:h-12 bg-border"></div>
            <div className="flex flex-col items-center">
              <span className="text-green text-2xl sm:text-3xl font-bold font-display">2m 14s</span>
              <span className="text-[10px] sm:text-sm text-center">Temps moyen</span>
            </div>
            <div className="hidden xs:block w-px h-8 sm:h-12 bg-border"></div>
            <div className="flex flex-col items-center">
              <span className="text-text-primary text-2xl sm:text-3xl font-bold font-display">100%</span>
              <span className="text-[10px] sm:text-sm text-center">Automatisé</span>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="flex justify-center">
            <a
              href="https://stitch.withgoogle.com/preview/4670336962817990775?node-id=b9e984092259499dbd4dc34fbfa2b8d1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green hover:bg-green-dark text-white px-8 py-4 rounded-xl font-body text-lg font-semibold transition-all hover:scale-105"
            >
              Voir le prototype interactif complet
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Portal;
