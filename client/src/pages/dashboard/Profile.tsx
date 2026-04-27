import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, ShieldCheck, Download, Edit2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

const Profile: React.FC = () => {
  const { profile, initiales, isLoading } = useProfile();

  if (isLoading) return <div className="p-8 animate-pulse bg-white rounded-3xl h-64"></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-dark">Profil Citoyen</h1>
          <p className="text-text-muted font-body">Informations officielles enregistrées au registre national.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">
          <Edit2 size={16} /> Modifier le profil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Digital ID Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 bg-[#23965F] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-green-900/20"
        >
          {/* Badge Background */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/5 rounded-full blur-2xl"></div>

          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                     <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">République de Guinée</p>
                    <p className="text-xs font-display font-black uppercase">Carte d'Identité Numérique</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold">
                  <ShieldCheck size={12} /> SÉCURISÉ
               </div>
            </div>

            <div className="flex gap-8 items-center">
               <div className="w-32 h-32 bg-white/10 rounded-[2rem] border-4 border-white/20 flex items-center justify-center text-4xl font-black">
                  {initiales}
               </div>
               <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Nom Complet</p>
                    <p className="text-2xl font-display font-black uppercase tracking-tight">{profile?.nom_complet}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-60">N° Citoyen</p>
                      <p className="font-mono font-bold">{profile?.numero_citoyen}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-60">Valide jusqu'au</p>
                      <p className="font-body font-bold text-sm">31 DEC 2030</p>
                    </div>
                  </div>
               </div>
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
               <div className="text-[8px] font-mono opacity-50 break-all w-2/3">
                  ID: {profile?.id} | BLOCK_HASH: 0x4f2e...9a12 | TIMESTAMP: 2026-04-27
               </div>
               <button className="bg-white text-green p-3 rounded-2xl hover:scale-110 transition-transform">
                  <Download size={20} />
               </button>
            </div>
          </div>
        </motion.div>

        {/* Details List */}
        <div className="space-y-4">
           <div className="bg-white border border-border rounded-3xl p-6 space-y-6">
              <h3 className="font-display font-bold text-dark text-sm border-b border-gray-50 pb-4">Coordonnées</h3>
              
              <div className="flex items-center gap-4 group">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green/10 group-hover:text-green transition-colors">
                    <Mail size={18} />
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Email</p>
                    <p className="text-sm font-semibold text-dark">{profile?.email}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4 group">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green/10 group-hover:text-green transition-colors">
                    <Phone size={18} />
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Téléphone</p>
                    <p className="text-sm font-semibold text-dark">{profile?.telephone || 'Non renseigné'}</p>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-border rounded-3xl p-6 space-y-6">
              <h3 className="font-display font-bold text-dark text-sm border-b border-gray-50 pb-4">État Civil</h3>
              
              <div className="flex items-center gap-4 group">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green/10 group-hover:text-green transition-colors">
                    <Calendar size={18} />
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Né(e) le</p>
                    <p className="text-sm font-semibold text-dark">{profile?.date_naissance || 'Non renseigné'}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4 group">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green/10 group-hover:text-green transition-colors">
                    <MapPin size={18} />
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Lieu</p>
                    <p className="text-sm font-semibold text-dark">{profile?.lieu_naissance || 'Non renseigné'}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
