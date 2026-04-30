import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, QrCode, Fingerprint, AlertTriangle, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import client from '@/api/client';
import { DashboardCard } from '@/components/dashboard/DashboardCards';

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

      <div className="relative group max-w-2xl mx-auto">
        <form onSubmit={handleVerify} className="relative z-10 flex gap-2 p-2 bg-white border border-dashboard-border rounded-admin shadow-sm transition-all focus-within:border-dashboard-sidebar/50">
           <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input 
                type="text" 
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Ex: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F..." 
                className="w-full pl-12 pr-4 py-4 rounded-xl outline-none font-mono text-sm bg-transparent"
              />
           </div>
           <button 
             type="submit"
             disabled={isVerifying}
             className="bg-dashboard-sidebar hover:bg-green-700 text-white px-8 rounded-xl font-display font-black transition-all flex items-center gap-2 disabled:opacity-50"
           >
              {isVerifying ? <Loader2 className="animate-spin" size={20} /> : 'VÉRIFIER'}
           </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
         <button className="flex items-center justify-center gap-3 p-6 bg-white border border-dashboard-border rounded-admin hover:border-dashboard-sidebar transition-all group shadow-sm">
            <QrCode size={24} className="text-gray-400 group-hover:text-dashboard-sidebar transition-colors" />
            <span className="font-display font-bold text-dark text-sm">Scanner un code QR</span>
         </button>
         <button className="flex items-center justify-center gap-3 p-6 bg-white border border-dashboard-border rounded-admin hover:border-dashboard-sidebar transition-all group shadow-sm">
            <ShieldCheck size={24} className="text-gray-400 group-hover:text-dashboard-sidebar transition-colors" />
            <span className="font-display font-bold text-dark text-sm">Téléverser un PDF</span>
         </button>
      </div>

      {(result || error) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto w-full"
        >
          {result ? (
            <DashboardCard title="Résultat de l'Authentification">
              <div className="flex flex-col items-center gap-6 py-4">
                <CheckCircle2 size={64} className="text-green-600 animate-bounce" />
                <div className="space-y-4 w-full">
                  <h3 className="text-xl font-display font-black uppercase italic text-green-700">Document Authentique</h3>
                  <div className="bg-dashboard-bg p-6 rounded-xl space-y-3 text-left border border-dashboard-border">
                    <div className="flex justify-between items-center border-b border-white/50 pb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Type de document</span>
                        <span className="text-sm font-bold text-dark">{result.type_document.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/50 pb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Référence</span>
                        <span className="text-sm font-mono font-bold text-dark">{result.reference}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Date d'émission</span>
                        <span className="text-sm font-bold text-dark">{new Date(result.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-green-700 font-bold bg-green-50 py-2 rounded-lg border border-green-100">
                    <ShieldCheck size={14} />
                    Ancrage blockchain confirmé sur NaissanceChain
                  </div>
                </div>
              </div>
            </DashboardCard>
          ) : null}
        </motion.div>
      )}
    </div>
  );
};

export default BlockchainVerify;
