import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Trophy, GraduationCap, Briefcase, 
  Users, Phone, Moon, Grid, ChevronDown, LogOut
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { profile, initiales, isLoading } = useProfile();

  const menuItems = [
    { name: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Concours', icon: <Trophy size={20} />, path: '/dashboard/concours' },
    { name: 'Formations', icon: <GraduationCap size={20} />, path: '/dashboard/formations' },
    { name: 'Gérer mes projets', icon: <Briefcase size={20} />, path: '/dashboard/projets' },
    { name: 'Accompagnements', icon: <Users size={20} />, path: '/dashboard/accompagnements' },
    { name: 'Nous contacter', icon: <Phone size={20} />, path: '/dashboard/contact' },
  ];

  return (
    <div className="dashboard-theme flex h-screen bg-[#F8F7F7] overflow-hidden font-sans">
      {/* Sidebar - Couleur Directe #23965F */}
      <aside className={`bg-[#23965F] flex flex-col shadow-2xl z-20 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className="p-6 min-w-[256px]">
          <div className="flex items-center space-x-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white p-1.5 rounded-lg shadow-sm hover:scale-105 transition-transform">
                <Grid className="text-[#23965F]" size={20} />
            </button>
            <div className="flex flex-col leading-tight">
                <span className="font-black text-white text-sm uppercase tracking-tighter italic">Le Portail de</span>
                <span className="font-black text-white text-lg tracking-tighter uppercase">l'Innovation</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-grow mt-4 px-3 space-y-1 min-w-[256px]">
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

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10">
          <div className="flex items-center space-x-4">
             {!sidebarOpen && (
               <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-50 rounded-lg text-[#23965F] transition-all">
                  <Grid size={24} />
               </button>
             )}
          </div>

          <div className="flex items-center space-x-6 text-gray-500">
            <div className="flex items-center space-x-4 border-r pr-6 border-gray-100">
                <button className="hover:text-[#23965F] transition-colors"><Moon size={22} /></button>
                <button className="hover:text-[#23965F] transition-colors"><Grid size={22} /></button>
            </div>
            
            <button className="flex items-center space-x-3 bg-[#23965F] hover:brightness-110 text-white px-4 py-2.5 rounded-full shadow-lg shadow-green-900/10 transition-all">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
                    <div className="w-28 h-3 rounded bg-white/20 animate-pulse" />
                  </div>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">
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

        <div className="flex-grow overflow-y-auto p-8 flex flex-col">
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
        </div>
      </main>
      
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#23965F] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50">
         <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-[#23965F] rounded-sm"></div>
         </div>
      </button>
    </div>
  );
};

export default DashboardLayout;
