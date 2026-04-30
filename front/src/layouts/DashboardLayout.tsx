import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, PlusCircle, ShieldCheck, 
  User, Moon, Grid, ChevronDown, LogOut
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { profile, initiales, isLoading } = useProfile();

  const menuItems = [
    { name: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Mes Documents', icon: <FileText size={20} />, path: '/dashboard/documents' },
    { name: 'Nouvelle Demande', icon: <PlusCircle size={20} />, path: '/dashboard/demandes/nouvelle' },
    { name: 'Vérification', icon: <ShieldCheck size={20} />, path: '/dashboard/verification' },
    { name: 'Mon Profil', icon: <User size={20} />, path: '/dashboard/profil' },
  ];

  return (
    <div className="dashboard-theme flex flex-col h-screen overflow-hidden font-sans">
      {/* Header Full Width - Blanc avec ombre subtile */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-20 shrink-0 shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-50 rounded-lg text-[#23965F] transition-all">
            <Grid size={24} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src="/logo.png" alt="IdentiGuinée Logo" className="h-10 w-auto" />
          </Link>
        </div>

        <div className="flex items-center space-x-6 text-gray-500">
          <div className="flex items-center space-x-4 border-r pr-6 border-gray-100">
              <button className="hover:text-[#23965F] transition-colors"><Moon size={22} /></button>
              <button className="hover:text-[#23965F] transition-colors"><Grid size={22} /></button>
          </div>
          
          <button className="flex items-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-full shadow-sm transition-all">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                  <div className="w-28 h-3 rounded bg-gray-100 animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 bg-dashboard-sidebar text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {initiales}
                  </div>
                  <span className="text-sm font-bold">
                    {profile?.nom_complet ?? 'Citoyen'}
                  </span>
                  <ChevronDown size={18} />
                </>
              )}
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar - Positionnée sous le header */}
        <aside className={`bg-[#23965F] flex flex-col shadow-xl z-10 transition-all duration-300 ease-in-out overflow-hidden ${sidebarOpen ? 'w-64' : 'w-0'}`}>
          <nav className={`flex-grow mt-6 px-3 space-y-1 min-w-[256px] transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.path 
                    ? 'bg-[#ffce00] text-gray-900 font-bold shadow-md' 
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-grow overflow-y-auto p-8 flex flex-col bg-[#F8F7F7]">
          <div className="flex-grow">
            <Outlet />
          </div>
          
          <footer className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
             <p>© 2026 IdentiGuinée - Portail de l'Innovation</p>
             <div className="flex space-x-6 text-gray-400">
                <a href="#" className="hover:text-[#23965F] transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-[#23965F] transition-colors">Aide</a>
             </div>
          </footer>
        </main>
      </div>
      
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#23965F] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50">
         <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-[#23965F] rounded-sm"></div>
         </div>
      </button>
    </div>
  );
};

export default DashboardLayout;
