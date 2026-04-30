import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

/**
 * Composant de carte générique pour le dashboard.
 * Respecte la bordure 1px grise et l'arrondi XL de la référence.
 */
export const DashboardCard: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white border border-dashboard-border rounded-admin p-6 shadow-sm ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-4 border-b border-dashboard-border pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

interface StatsCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  variant: 'blue' | 'orange' | 'red' | 'green';
}

/**
 * Composant de statistique avec icône sur fond coloré (style référence).
 */
export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, variant }) => {
  const variantStyles = {
    blue:   { bg: 'bg-blue-50', text: 'text-blue-600',   iconBg: 'bg-blue-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'bg-orange-100' },
    red:    { bg: 'bg-red-50', text: 'text-red-600',    iconBg: 'bg-red-100' },
    green:  { bg: 'bg-green-50', text: 'text-green-600',  iconBg: 'bg-green-100' },
  };

  const style = variantStyles[variant];

  return (
    <div className="bg-white border border-dashboard-border rounded-admin p-6 flex items-center space-x-4 shadow-sm transition-colors duration-200">
      <div className={`w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center ${style.text}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-text-primary leading-none">{value}</div>
        <div className={`text-sm font-medium mt-1 ${style.text}`}>{label}</div>
      </div>
    </div>
  );
};
