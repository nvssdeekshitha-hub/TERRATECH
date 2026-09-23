import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { StateProjectChart } from '../components/charts/StateProjectChart';
import { DistrictDelayChart } from '../components/charts/DistrictDelayChart';
import { DelayTrendChart } from '../components/charts/DelayTrendChart';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { BarChart3, TrendingUp, Building2, Map } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { projects } = useProjects();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Macro State & District Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          High-level state-wise and district-level performance analytics, processing time bottlenecks, and trend analysis
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StateProjectChart projects={projects} />
        <DistrictDelayChart projects={projects} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DelayTrendChart />
        <RiskDistributionChart projects={projects} />
      </div>
    </div>
  );
};
