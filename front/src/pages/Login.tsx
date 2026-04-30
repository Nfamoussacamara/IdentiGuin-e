import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import client from '@/api/client';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // On s'assure que le localStorage est propre
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      // Le validateur attend la clé 'email' comme confirmé par l'inspection
      const response = await client.post('/auth/connexion/', {
        email: email,
        password,
      });

      const { access, refresh } = response.data;
      if (access && refresh) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        toast.success("Connexion réussie ! Bienvenue sur votre espace citoyen.");
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      toast.error(
        err.response?.data?.detail || 
        "Identifiants invalides ou erreur serveur. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-bg overflow-hidden">
      
      {/* --- PANNEAU GAUCHE (VISUEL) --- */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-green-dark overflow-hidden flex-col justify-center p-12 lg:p-24"
      >
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-green filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400 filter blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Floating Icons for Aesthetic */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 text-white/10"
        >
          <ShieldCheck size={200} />
        </motion.div>

        <div className="relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <span className="text-white/80 font-display font-bold tracking-widest uppercase text-sm">Sécurité d'État</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-4xl lg:text-6xl font-display font-black text-white leading-tight mb-6"
          >
            Identité numérique <br />
            <span className="text-emerald-300">sécurisée et fiable</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-white/70 text-lg lg:text-xl font-body max-w-xl leading-relaxed mb-10"
          >
            Le portail national de l'innovation et de l'identité citoyenne. 
            Une infrastructure robuste basée sur la blockchain pour garantir l'authenticité et lutter contre la fraude documentaire.
          </motion.p>
        </div>

        {/* Footer info gauche */}
        <div className="absolute bottom-12 left-12 lg:left-24">
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
            Republic of Guinea • Ministry of Digital Economy
          </p>
        </div>
      </motion.div>

      {/* --- PANNEAU DROIT (FORMULAIRE) --- */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 lg:w-2/5 bg-white flex flex-col p-8 sm:p-12 lg:p-20 justify-center relative shadow-[-20px_0_50px_rgba(0,0,0,0.05)]"
      >
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="mb-12">
            <Link to="/">
              <img src="/logo.png" alt="IdentiGuinée Logo" className="h-16 lg:h-20 w-auto mb-8 hover:scale-105 transition-transform" />
            </Link>
            <h2 className="text-3xl font-display font-black text-dark mb-2">Connexion</h2>
            <p className="text-text-muted font-body">Veuillez entrer vos identifiants pour accéder à votre espace citoyen.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Global errors are now handled by toasts */}

            <div className="space-y-2">
              <label className="text-sm font-display font-bold text-dark ml-1">Email ou Identifiant</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 text-dark text-sm rounded-2xl focus:ring-2 focus:ring-green/20 focus:border-green block p-4 pl-12 transition-all outline-none font-body"
                  placeholder="nom@exemple.gn"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-display font-bold text-dark">Mot de passe</label>
                <a href="#" className="text-xs font-bold text-green hover:text-green-dark transition-colors">Mot de passe oublié ?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 text-dark text-sm rounded-2xl focus:ring-2 focus:ring-green/20 focus:border-green block p-4 pl-12 pr-12 transition-all outline-none font-body"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-green hover:bg-green-dark text-white font-display font-bold py-4 rounded-2xl shadow-xl shadow-green/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70"
            >
              {isLoading ? (
                <div key="loader" className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Traitement...</span>
                </div>
              ) : (
                <div key="content" className="flex items-center gap-2">
                  Se connecter
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-text-muted font-body text-sm mb-4">Vous n'avez pas encore de compte ?</p>
            <button className="w-full bg-white border-2 border-green text-green hover:bg-green/5 font-display font-bold py-4 rounded-2xl transition-all active:scale-[0.98]">
              Créer un compte citoyen
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default Login;
