import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, QrCode, Fingerprint, AlertTriangle, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import client from '@/api/client';

const BlockchainVerify: React.FC = () => {
  const [hash, setHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash) return;
    
    setIsVerifying(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await client.get(`/verification/rechercher/?q=${hash}`);
      setResult(response.data);
      toast.success("Document authentifié avec succès sur la blockchain !");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Erreur lors de la vérification.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8 text-center">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-green/10 rounded-3xl flex items-center justify-center text-green mx-auto mb-6">
          <Fingerprint size={40} />
        </div>
        <h1 className="text-3xl font-display font-black text-dark uppercase tracking-tight">Authentificateur Blockchain</h1>
        <p className="text-text-muted font-body max-w-lg mx-auto">
          Saisissez la référence ou le hash d'un document pour vérifier son intégrité sur le réseau <strong>NaissanceChain</strong>.
        </p>
      </div>

      <div className="relative group">
        <form onSubmit={handleVerify} className="relative z-10 flex gap-2 p-2 bg-white border border-border rounded-3xl shadow-2xl shadow-green-900/5">
           <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input 
                type="text" 
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Ex: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-mono text-sm focus:bg-gray-50 transition-colors"
              />
           </div>
           <button 
             type="submit"
             disabled={isVerifying}
             className="bg-green hover:bg-green-dark text-white px-8 rounded-2xl font-display font-black transition-all flex items-center gap-2 disabled:opacity-50"
           >
              {isVerifying ? <Loader2 className="animate-spin" size={20} /> : 'VÉRIFIER'}
           </button>
        </form>
        
        <div className="absolute inset-0 bg-green/10 blur-3xl rounded-full -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <button className="flex items-center justify-center gap-3 p-6 bg-white border border-border rounded-3xl hover:border-green/30 transition-all group">
            <QrCode size={24} className="text-text-muted group-hover:text-green transition-colors" />
            <span className="font-display font-bold text-dark text-sm">Scanner un QR Code</span>
         </button>
         <button className="flex items-center justify-center gap-3 p-6 bg-white border border-border rounded-3xl hover:border-green/30 transition-all group">
            <ShieldCheck size={24} className="text-text-muted group-hover:text-green transition-colors" />
            <span className="font-display font-bold text-dark text-sm">Uploader un certificat PDF</span>
         </button>
      </div>

      {(result || error) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-[2rem] border-4 flex flex-col items-center gap-6 ${
            result ? 'bg-green-light border-green/30 text-green' : 'hidden'
          }`}
        >
          {result ? (
            <>
              <CheckCircle2 size={64} className="animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-black uppercase italic">Document Authentique</h3>
                <div className="bg-white/50 p-4 rounded-2xl space-y-2 text-left border border-green/10">
                   <div className="flex justify-between gap-8">
                      <span className="text-[10px] font-bold opacity-60 uppercase">Type</span>
                      <span className="text-xs font-bold">{result.type_document}</span>
                   </div>
                   <div className="flex justify-between gap-8">
                      <span className="text-[10px] font-bold opacity-60 uppercase">Référence</span>
                      <span className="text-xs font-mono font-bold">{result.reference}</span>
                   </div>
                   <div className="flex justify-between gap-8">
                      <span className="text-[10px] font-bold opacity-60 uppercase">Délivré le</span>
                      <span className="text-xs font-bold">{new Date(result.created_at).toLocaleDateString()}</span>
                   </div>
                </div>
                <p className="text-[10px] opacity-60 mt-4">Ancrage blockchain confirmé sur le réseau NaissanceChain</p>
              </div>
            </>
          ) : null}
        </motion.div>
      )}
    </div>
  );
};

export default BlockchainVerify;
