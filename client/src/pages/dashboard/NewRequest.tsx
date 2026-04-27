import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, BookOpen, ArrowRight, ShieldCheck, Upload, Info } from 'lucide-react';

const documentTypes = [
  { id: 'BIRTH', name: 'Extrait de Naissance', icon: <FileText className="text-blue-500" />, desc: 'Copie intégrale ou extrait d\'acte de naissance informatisé.' },
  { id: 'CNI', name: 'Carte d\'Identité (CNI)', icon: <CreditCard className="text-green" />, desc: 'Nouvelle carte d\'identité biométrique sécurisée.' },
  { id: 'PASSPORT', name: 'Passeport Ordinaire', icon: <BookOpen className="text-red-500" />, desc: 'Document de voyage électronique valide 5 ou 10 ans.' },
];

const NewRequest: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-display font-black text-dark">Nouvelle Demande</h1>
        <p className="text-text-muted font-body">Sélectionnez le type de document que vous souhaitez obtenir.</p>
      </div>

      {step === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {documentTypes.map((type) => (
            <motion.button
              whileHover={{ y: -5 }}
              onClick={() => setSelectedType(type.id)}
              key={type.id}
              className={`p-6 bg-white border-2 rounded-3xl text-left transition-all ${
                selectedType === type.id ? 'border-green shadow-xl shadow-green/10' : 'border-border hover:border-green/30'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                {type.icon}
              </div>
              <h3 className="font-display font-bold text-dark mb-2">{type.name}</h3>
              <p className="text-text-muted text-xs leading-relaxed mb-6">{type.desc}</p>
              <div className={`flex items-center gap-2 text-xs font-bold ${selectedType === type.id ? 'text-green' : 'text-gray-400'}`}>
                SÉLECTIONNER <ArrowRight size={14} />
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-border rounded-3xl p-8 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50">
             <button onClick={() => setStep(1)} className="text-text-muted hover:text-green font-bold text-sm">← Retour</button>
             <div className="h-4 w-px bg-border"></div>
             <span className="font-display font-bold text-dark">Formulaire : {documentTypes.find(t => t.id === selectedType)?.name}</span>
          </div>
          
          <div className="space-y-6">
             <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 text-blue-800 text-sm">
                <Info size={20} className="shrink-0" />
                <p>Vos informations d'état civil seront automatiquement récupérées via <strong>NaissanceChain</strong> pour garantir l'exactitude des données.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Motif de la demande</label>
                   <select className="w-full bg-gray-50 border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green/20">
                      <option>Première délivrance</option>
                      <option>Renouvellement</option>
                      <option>Perte / Vol</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Lieu de retrait souhaité</label>
                   <select className="w-full bg-gray-50 border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green/20">
                      <option>Mairie de Matam (Conakry)</option>
                      <option>Mairie de Ratoma (Conakry)</option>
                      <option>Direction de la Police aux Frontières</option>
                   </select>
                </div>
             </div>

             <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Documents justificatifs (PDF/JPG)</label>
                <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center hover:border-green/50 transition-colors cursor-pointer group">
                   <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-green/10 group-hover:text-green transition-colors">
                      <Upload size={24} />
                   </div>
                   <p className="text-sm font-bold text-dark">Cliquez pour téléverser vos fichiers</p>
                   <p className="text-xs text-text-muted mt-1">Glissez-déposez vos pièces d'identité ou justificatifs de domicile</p>
                </div>
             </div>
          </div>
        </motion.div>
      )}

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
