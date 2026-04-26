import { useDashboardData } from '../hooks/useDashboardData';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { StatusChart } from '../components/dashboard/StatusChart';
import { RecentDocumentsList } from '../components/dashboard/RecentDocumentsList';

const DashboardHome = () => {
  const { loading, stats, demandes, error } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-[0.75rem]"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="h-64 skeleton rounded-[0.75rem]"></div>
           <div className="h-64 skeleton rounded-[0.75rem]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-xl">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Statistiques Cards */}
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique */}
        <StatusChart stats={stats} />

        {/* Liste des Demandes Réelles */}
        <RecentDocumentsList demandes={demandes} />
      </div>
    </div>
  );
};

export default DashboardHome;
