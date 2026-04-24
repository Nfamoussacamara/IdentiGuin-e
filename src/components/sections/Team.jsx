import { motion } from 'framer-motion';
import { Mail, Link as LinkIcon, ExternalLink } from 'lucide-react';

const teamMembers = [
  {
    name: "Camara N'famoussa",
    role: "Chef de Projet / Tech Lead",
    image: "/Guinée tech lab/profil.jpeg",
  },
  {
    name: "Abdoul Aziz Diallo",
    role: "Développeur Full-Stack",
    image: "/Guinée tech lab/Abdoul Aziz Diallo.jpeg",
  },
  {
    name: "Diallo Sonna Halimatou",
    role: "Product Designer / UI UX",
    image: "/Guinée tech lab/Diallo Sonna Halimatou.jpeg",
  },
  {
    name: "KABA Sanoussy",
    role: "Ingénieur Blockchain",
    image: "/Guinée tech lab/KABA Sanoussy.jpeg",
  }
];

export default function Team() {
  return (
    <section id="equipe" className="py-24 relative overflow-hidden" style={{ backgroundColor: '#f5faf6' }}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* En-tête de section */}
        <div className="mb-16 reveal-on-scroll">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-green"></span>
            <span className="text-xs font-semibold font-heading text-green uppercase tracking-widest">Section 06 — L'équipe</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight max-w-3xl">
            L'expertise derrière <span className="text-green">IdentiGuinée</span>
          </h2>
          <p className="text-text-muted mt-6 max-w-2xl text-lg font-body">
            Une équipe passionnée du Guinée Tech Lab, dédiée à la transformation numérique et à la souveraineté technologique de la Guinée.
          </p>
        </div>

        {/* Grille de l'équipe */}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8 }}
              className="group glass-card rounded-3xl p-6 border border-border hover:border-green/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-green/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img 
                  src={encodeURI(member.image)} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Infos */}
              <div>
                <h3 className="font-heading font-bold text-xl text-text-primary mb-1">{member.name}</h3>
                <p className="text-green text-sm font-semibold mb-4">{member.role}</p>
                
                {/* Réseaux (Design only) */}
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <a href="#" className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center text-green hover:bg-green hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center text-green hover:bg-green hover:text-white transition-colors">
                    <LinkIcon className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center text-green hover:bg-green hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
