import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', organization: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setForm({ name: '', email: '', organization: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Info */}
          <div className="reveal-on-scroll">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-0.5 bg-primary"></span>
                <span className="text-xs font-semibold font-heading text-primary uppercase tracking-widest">Contact & Partenariat</span>
              </div>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-text-primary leading-tight mb-6">
                Rejoindre ou soutenir{' '}
                <span className="text-primary">IdentiGuinée</span>
              </h2>
              <p className="text-base text-text-muted leading-relaxed mb-10">
                Vous représentez une institution publique, une ONG, un partenaire technique ou un investisseur ? Contactez l'équipe IdentiGuinée pour explorer les opportunités de collaboration.
              </p>
            </motion.div>

            {/* Contact info cards */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="space-y-4"
            >
              <motion.div 
                variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-5 p-5 bg-bg rounded-2xl border border-border transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold font-heading text-text-muted uppercase tracking-wider mb-1">Organisateur</p>
                  <p className="text-sm font-bold text-text-primary">Darollo Technologies Corporation</p>
                </div>
              </motion.div>

              <motion.div 
                variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-5 p-5 bg-bg rounded-2xl border border-border transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold font-heading text-text-muted uppercase tracking-wider mb-1">Site officiel</p>
                  <a href="https://www.miabehackathon.com" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline">
                    www.miabehackathon.com
                  </a>
                </div>
              </motion.div>

              <motion.div 
                variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-5 p-5 bg-bg rounded-2xl border border-border transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold font-heading text-text-muted uppercase tracking-wider mb-1">Partenaire institutionnel</p>
                  <p className="text-sm font-bold text-text-primary">Ministère de l'Administration du Territoire de Guinée</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="reveal-on-scroll delay-200"
          >
            <div className="bg-white rounded-3xl border border-border p-8 sm:p-10">
              <h3 className="font-heading font-bold text-2xl text-text-primary mb-8">Formulaire de contact</h3>

              {status === 'success' && (
                <div className="mb-8 p-4 bg-primary/10 rounded-xl border border-primary/20 flex items-start gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 text-green">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <p className="text-sm font-semibold text-primary leading-relaxed">Message envoyé ! L'équipe IdentiGuinée vous répondra dans les plus brefs délais.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-8 p-4 bg-danger/10 rounded-xl border border-danger/20 flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A64242" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p className="text-sm font-semibold text-danger">Veuillez remplir les champs obligatoires marqués d'un astérisque.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold font-heading text-text-primary uppercase tracking-wider mb-2">
                      Nom complet <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Mamadou Diallo"
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg text-text-primary text-sm placeholder-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold font-heading text-text-primary uppercase tracking-wider mb-2">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="contact@organisation.gn"
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg text-text-primary text-sm placeholder-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-text-primary uppercase tracking-wider mb-2">
                    Organisation / Institution
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    placeholder="Ministère, ONG, Entreprise..."
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg text-text-primary text-sm placeholder-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-text-primary uppercase tracking-wider mb-2">
                    Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Décrivez votre intérêt pour IdentiGuinée, votre rôle, vos questions..."
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg text-text-primary text-sm placeholder-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-body"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-heading font-bold text-sm rounded-xl hover:bg-opacity-90 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Envoyer le message
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>

                <p className="text-xs text-text-muted text-center pt-2">
                  En soumettant ce formulaire, vous acceptez d'être contacté par l'équipe IdentiGuinée dans le cadre du MIABE Hackathon 2026.
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
