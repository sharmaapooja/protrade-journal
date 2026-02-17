
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, trend, colorClass }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <i className="fas fa-arrow-up text-emerald-500 ml-1"></i>;
    if (trend === 'down') return <i className="fas fa-arrow-down text-rose-500 ml-1"></i>;
    return null;
  };

  return (
    <div className="glass p-5 rounded-2xl flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass || 'bg-blue-500/10 text-blue-500'}`}>
          <i className={`fas ${icon} text-lg`}></i>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</span>
      </div>
      <div>
        <div className="flex items-baseline">
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          {getTrendIcon()}
        </div>
        {subValue && <p className="text-sm text-slate-500 mt-1">{subValue}</p>}
      </div>
    </div>
  );
};
