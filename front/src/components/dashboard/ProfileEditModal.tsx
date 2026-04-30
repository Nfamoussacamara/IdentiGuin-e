import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, Briefcase, Camera, Save, LoaderCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '@/api/documents';
import type { IProfile } from '@/types';
import { toast } from 'sonner';

interface ProfileEditModalProps {
  profile: IProfile;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ profile, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<IProfile>>({
    nin: profile.nin || '',
    genre: profile.genre || 'M',
    taille: profile.taille || 1.70,
    profession: profile.profession || '',
    pere_nom_complet: profile.pere_nom_complet || '',
    mere_nom_complet: profile.mere_nom_complet || '',
    adresse: profile.adresse || '',
    region: profile.region || '',
    prefecture: profile.prefecture || '',
    commune: profile.commune || '',
    quartier: profile.quartier || '',
    secteur: profile.secteur || '',
    telephone: profile.telephone || '',
  });

  const [photoFile, setPhotoFile] = useState<File | undefined>();
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile.photo || null);

  const mutation = useMutation({
    mutationFn: () => updateProfile(formData, photoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profil mis à jour avec succès');
      onClose();
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la mise à jour du profil');
      console.error(error);
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green/10 text-green rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-dark">Compléter mon profil</h2>
              <p className="text-xs text-text-muted">Ces informations sont requises pour la Phase 2.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Photo Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 bg-gray-100 rounded-[2rem] overflow-hidden border-4 border-gray-50 shadow-inner">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <User size={48} />
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 p-2 bg-green text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            </div>
            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Photo d'identité officielle</p>
          </div>

          {/* Grid Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity */}
            <div className="space-y-4 col-span-full">
               <h3 className="text-xs font-black uppercase text-green tracking-widest border-l-4 border-green pl-3">Identité Biométrique</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">NIN (15 chiffres)</label>
                    <input 
                      name="nin" value={formData.nin} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-mono font-bold" 
                      placeholder="Ex: 1920..." 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Genre</label>
                    <select 
                      name="genre" value={formData.genre} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold"
                    >
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Taille (m)</label>
                    <input 
                      type="number" step="0.01" name="taille" value={formData.taille} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Profession</label>
                    <input 
                      name="profession" value={formData.profession} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold" 
                      placeholder="Ex: Ingénieur"
                    />
                  </div>
               </div>
            </div>

            {/* Filiation */}
            <div className="space-y-4 col-span-full">
               <h3 className="text-xs font-black uppercase text-green tracking-widest border-l-4 border-green pl-3">Filiation</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nom complet du Père</label>
                    <input 
                      name="pere_nom_complet" value={formData.pere_nom_complet} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nom complet de la Mère</label>
                    <input 
                      name="mere_nom_complet" value={formData.mere_nom_complet} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold" 
                    />
                  </div>
               </div>
            </div>

            {/* Location */}
            <div className="space-y-4 col-span-full">
               <h3 className="text-xs font-black uppercase text-green tracking-widest border-l-4 border-green pl-3 text-dashboard-sidebar">Localisation & Domicile</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Région</label>
                    <input name="region" value={formData.region} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Préfecture</label>
                    <input name="prefecture" value={formData.prefecture} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Commune</label>
                    <input name="commune" value={formData.commune} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Quartier</label>
                    <input name="quartier" value={formData.quartier} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Secteur</label>
                    <input name="secteur" value={formData.secteur} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-1 col-span-full">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Adresse de domicile précise</label>
                    <textarea 
                      name="adresse" value={formData.adresse} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green outline-none transition-all font-bold min-h-[80px]" 
                    />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
           <button 
             onClick={onClose}
             className="flex-1 px-6 py-4 border border-border rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
           >
             Annuler
           </button>
           <button 
             onClick={() => mutation.mutate()}
             disabled={mutation.isPending}
             className="flex-[2] px-6 py-4 bg-green text-white rounded-2xl font-black shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
           >
             {mutation.isPending ? (
               <LoaderCircle className="animate-spin" size={20} />
             ) : (
               <>
                 <Save size={20} />
                 <span>Enregistrer mon profil</span>
               </>
             )}
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileEditModal;
