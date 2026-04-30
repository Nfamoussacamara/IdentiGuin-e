import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CreditCard, BookOpen, ArrowRight, ShieldCheck, Upload, Info, Loader2, CheckCircle } from 'lucide-react';
import { createDemande } from '@/api/documents';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardCard } from '@/components/dashboard/DashboardCards';

const documentTypes = [
  { id: 'EXTRAIT_NAIS', name: 'Extrait de Naissance', icon: <FileText className="text-blue-500" />, desc: 'Copie intégrale ou extrait d\'acte de naissance informatisé.' },
  { id: 'CNI', name: 'Carte d\'Identité (CNI)', icon: <CreditCard className="text-green" />, desc: 'Nouvelle carte d\'identité biométrique sécurisée.' },
  { id: 'PASSEPORT', name: 'Passeport Ordinaire', icon: <BookOpen className="text-red-500" />, desc: 'Document de voyage électronique valide 5 ou 10 ans.' },
];

const NewRequest: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await createDemande(selectedType, files);
      toast.success("Votre demande a été envoyée avec succès !");
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard/documents'), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Une erreur est survenue lors de la soumission.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green/10 text-green rounded-full flex items-center justify-center">
          <CheckCircle size={48} />
        </motion.div>
        <h2 className="text-2xl font-display font-black text-dark">Demande envoyée !</h2>
        <p className="text-text-muted">Votre demande a été enregistrée. Redirection vers vos documents...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-display font-black text-dark">Nouvelle Demande</h1>
        <p className="text-text-muted font-body">Sélectionnez le type de document que vous souhaitez obtenir.</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {documentTypes.map((type) => (
              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => setSelectedType(type.id)}
                key={type.id}
                className={`p-6 bg-white border rounded-admin text-left transition-all relative ${
                  selectedType === type.id 
                    ? 'border-dashboard-sidebar ring-2 ring-dashboard-sidebar/10' 
                    : 'border-dashboard-border hover:border-dashboard-sidebar/30'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                  {type.icon}
                </div>
                <h3 className="font-display font-bold text-dark text-lg mb-2">{type.name}</h3>
                <p className="text-text-muted text-xs leading-relaxed mb-8">{type.desc}</p>
                <div className={`flex items-center gap-2 text-[10px] font-black tracking-widest uppercase ${selectedType === type.id ? 'text-dashboard-sidebar' : 'text-gray-400'}`}>
                  {selectedType === type.id ? 'SÉLECTIONNÉ' : 'SÉLECTIONNER'} <ArrowRight size={14} />
                </div>
                
                {selectedType === type.id && (
                  <div className="absolute top-4 right-4 text-dashboard-sidebar">
                    <CheckCircle size={20} />
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <DashboardCard title={`Formulaire : ${documentTypes.find(t => t.id === selectedType)?.name}`}>
            <div className="space-y-6 mt-4">
               <button onClick={() => setStep(1)} className="text-dashboard-sidebar hover:underline font-bold text-sm mb-4 inline-block">← Retour à la sélection</button>
               
               <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 text-blue-800 text-sm">
                  <Info size={20} className="shrink-0" />
                  <p>Vos informations d'état civil seront automatiquement récupérées via <strong>NaissanceChain</strong> pour garantir l'exactitude des données.</p>
               </div>

               <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Documents justificatifs (PDF/JPG)</label>
                  <label className="border-2 border-dashed border-dashboard-border rounded-admin p-12 text-center hover:border-dashboard-sidebar/50 transition-colors cursor-pointer group block">
                     <input type="file" multiple className="hidden" onChange={handleFileChange} />
                     <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-50 group-hover:text-dashboard-sidebar transition-colors">
                        <Upload size={24} />
                     </div>
                     <p className="text-sm font-bold text-dark">
                        {files.length > 0 ? `${files.length} fichier(s) sélectionné(s)` : "Cliquez pour téléverser vos fichiers"}
                     </p>
                     <p className="text-xs text-text-muted mt-1">Glissez-déposez vos pièces d'identité ou justificatifs de domicile</p>
                  </label>
                  
                  {files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {files.map((file, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600">
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
               </div>

               <div className="pt-6">
                 <button 
                   onClick={handleSubmit}
                   disabled={isSubmitting}
                   className="w-full bg-dashboard-sidebar text-white font-display font-black py-4 rounded-admin shadow-lg shadow-green-900/10 flex items-center justify-center gap-3 disabled:opacity-70"
                 >
                   {isSubmitting ? <Loader2 className="animate-spin" /> : "SOUMETTRE LA DEMANDE"}
                 </button>
               </div>
            </div>
          </DashboardCard>
        )}
      </AnimatePresence>

      {selectedType && step === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green p-6 rounded-3xl flex items-center justify-between shadow-xl shadow-green/20"
        >
          <div className="flex items-center gap-4 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold opacity-80 uppercase">Sélection actuelle</p>
              <p className="font-display font-black text-lg">{documentTypes.find(t => t.id === selectedType)?.name}</p>
            </div>
          </div>
          <button 
            onClick={() => setStep(2)}
            className="bg-white text-green font-display font-black px-8 py-3 rounded-2xl hover:scale-105 transition-transform"
          >
            Continuer
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default NewRequest;
