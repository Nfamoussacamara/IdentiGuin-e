import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, ShieldCheck, Download, Edit2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { DashboardCard } from '@/components/dashboard/DashboardCards';
import ProfileEditModal from '@/components/dashboard/ProfileEditModal';

const Profile: React.FC = () => {
  const { profile, initiales, isLoading } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div className="p-8 animate-pulse bg-white rounded-3xl h-64"></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-dark">Profil Citoyen</h1>
          <p className="text-text-muted font-body">Informations officielles enregistrées au registre national.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
        >
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
               <div className="w-32 h-32 bg-white/10 rounded-[2rem] border-4 border-white/20 flex items-center justify-center text-4xl font-black overflow-hidden">
                  {profile?.photo ? (
                    <img src={profile.photo} alt={profile.nom_complet} className="w-full h-full object-cover" />
                  ) : initiales}
               </div>
               <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Nom Complet</p>
                    <p className="text-2xl font-display font-black uppercase tracking-tight">{profile?.nom_complet}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-60">NIN</p>
                      <p className="font-mono font-bold tracking-wider">{profile?.nin || '--- --- --- ---'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-60">Valide jusqu'au</p>
                      <p className="font-body font-bold text-sm">31 DEC 2030</p>
                    </div>
                  </div>
               </div>

               {/* Ghost Image for security */}
               {profile?.photo && (
                  <div className="absolute right-32 top-1/2 -translate-y-1/2 w-24 h-24 opacity-10 grayscale pointer-events-none">
                     <img src={profile.photo} alt="Ghost" className="w-full h-full object-contain" />
                  </div>
               )}
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
               <div className="text-[8px] font-mono opacity-50 break-all w-2/3">
                  ID: {profile?.id} | NIN: {profile?.nin} | GENRE: {profile?.genre} | TAILLE: {profile?.taille}m
               </div>
               <button className="bg-white text-green p-3 rounded-2xl hover:scale-110 transition-transform">
                  <Download size={20} />
               </button>
            </div>
          </div>
        </motion.div>

        {/* Details List */}
        <div className="space-y-4">
           <DashboardCard title="Données Biométriques">
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-gray-50 rounded-xl">
                   <p className="text-[10px] uppercase font-bold text-gray-400">Genre</p>
                   <p className="text-sm font-semibold text-dark">{profile?.genre === 'M' ? 'Masculin' : profile?.genre === 'F' ? 'Féminin' : '---'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                   <p className="text-[10px] uppercase font-bold text-gray-400">Taille</p>
                   <p className="text-sm font-semibold text-dark">{profile?.taille ? `${profile.taille} m` : '---'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl col-span-2">
                   <p className="text-[10px] uppercase font-bold text-gray-400">Profession</p>
                   <p className="text-sm font-semibold text-dark">{profile?.profession || '---'}</p>
                </div>
              </div>
           </DashboardCard>

           <DashboardCard title="Filiation">
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-3">
                   <User size={16} className="text-gray-400" />
                   <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Père</p>
                      <p className="text-sm font-semibold text-dark">{profile?.pere_nom_complet || '---'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <User size={16} className="text-gray-400" />
                   <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Mère</p>
                      <p className="text-sm font-semibold text-dark">{profile?.mere_nom_complet || '---'}</p>
                   </div>
                </div>
              </div>
           </DashboardCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <DashboardCard title="Localisation & Adresse">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
               <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Région</p>
                  <p className="text-sm font-semibold text-dark border-b border-gray-100 pb-1">{profile?.region || '---'}</p>
               </div>
               <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Préfecture</p>
                  <p className="text-sm font-semibold text-dark border-b border-gray-100 pb-1">{profile?.prefecture || '---'}</p>
               </div>
               <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Commune</p>
                  <p className="text-sm font-semibold text-dark border-b border-gray-100 pb-1">{profile?.commune || '---'}</p>
               </div>
               <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Quartier</p>
                  <p className="text-sm font-semibold text-dark border-b border-gray-100 pb-1">{profile?.quartier || '---'}</p>
               </div>
               <div className="col-span-2">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Adresse Complète</p>
                  <p className="text-sm font-semibold text-dark bg-gray-50 p-3 rounded-xl mt-1">{profile?.adresse || 'Non renseignée'}</p>
               </div>
            </div>
         </DashboardCard>

         <DashboardCard title="État Civil & Registre">
            <div className="space-y-6 mt-2">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                     <Calendar size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-bold text-gray-400">Date de naissance</p>
                     <p className="text-sm font-semibold text-dark">{profile?.date_naissance || '---'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                     <MapPin size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-bold text-gray-400">Lieu de naissance</p>
                     <p className="text-sm font-semibold text-dark">{profile?.lieu_naissance || '---'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-bold text-gray-400">N° Registre Naissance</p>
                     <p className="text-sm font-mono font-bold text-dark">{profile?.numero_registre_naissance || '---'}</p>
                  </div>
               </div>
            </div>
         </DashboardCard>
      </div>

      <AnimatePresence>
        {isModalOpen && profile && (
          <ProfileEditModal 
            profile={profile} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
