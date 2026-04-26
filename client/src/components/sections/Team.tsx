import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const teamMembers = [
  {
    name: "Camara N'famoussa",
    role: "Chef de Groupe",
    image: "/Guinée tech lab/profil.jpeg",
  },
  {
    name: "Abdoul Aziz Diallo",
    role: "Membre",
    image: "/Guinée tech lab/Abdoul Aziz Diallo.jpeg",
  },
  {
    name: "Diallo Sonna Halimatou",
    role: "Membre",
    image: "/Guinée tech lab/Diallo Sonna Halimatou.jpeg",
  },
  {
    name: "KABA Sanoussy",
    role: "Membre",
    image: "/Guinée tech lab/KABA Sanoussy.jpeg",
  }
];

// SVGs personnalisés pour éviter les erreurs d'import lucide-react
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

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

        {/* Grille de l'équipe : design exact selon capture */}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              className="group relative aspect-[3/4] overflow-hidden bg-gray-200 cursor-pointer shadow-sm"
            >
              {/* Image pleine carte */}
              <img 
                src={encodeURI(member.image)} 
                alt={member.name} 
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay (visible au survol) avec animation fade top */}
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                
                <h3 className="font-bold text-xl mb-3 text-center px-4 text-green">
                  {member.name}
                </h3>
                
                <p className="text-white/70 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase mb-8 text-center px-4">
                  {member.role}
                </p>
                
                <button className="bg-white text-black font-semibold text-sm px-6 py-2 rounded mb-6 hover:bg-green-light transition-colors">
                  parcours
                </button>
                
                <div className="flex items-center gap-4">
                  <a href="#" className="text-white hover:text-green transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-white hover:text-green transition-colors">
                    <TwitterIcon />
                  </a>
                  <a href="#" className="text-white hover:text-green transition-colors">
                    <GithubIcon />
                  </a>
                </div>

              </div>
              
              {/* Bordure verte animée de gauche à droite */}
              <div className="absolute bottom-0 left-0 h-2 bg-green w-0 group-hover:w-full transition-all duration-700 ease-out z-20"></div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
