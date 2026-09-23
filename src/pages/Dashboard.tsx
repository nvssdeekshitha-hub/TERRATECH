import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { StatCard } from '../components/common/StatCard';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { StateProjectChart } from '../components/charts/StateProjectChart';
import { DistrictDelayChart } from '../components/charts/DistrictDelayChart';
import { DelayTrendChart } from '../components/charts/DelayTrendChart';
import { ProjectTable } from '../components/projects/ProjectTable';
import { AlertCard } from '../components/projects/AlertCard';
import {
  FolderKanban,
  AlertTriangle,
  ShieldAlert,
  Percent,
  Clock,
  CheckCircle2,
  Bell,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { projects, systemHealth } = useProjects();
  const navigate = useNavigate();

  const totalProjects = projects.length;
  const highRiskCount = projects.filter((p) => p.prediction?.risk_category === 'HIGH').length;
  const criticalCount = projects.filter((p) => p.prediction?.risk_category === 'CRITICAL').length;

  const avgProb =
    projects.reduce((acc, p) => acc + (p.prediction?.delay_probability || 0), 0) /
    (totalProjects || 1);

  const avgDelayDays = Math.round(
    projects.reduce((acc, p) => acc + (p.prediction?.estimated_delay_days || 0), 0) /
      (totalProjects || 1)
  );

  const requiringActionCount = projects.filter(
    (p) => p.prediction?.risk_category === 'HIGH' || p.prediction?.risk_category === 'CRITICAL'
  ).length;

  const allAlerts = projects.flatMap((p) => p.alerts).filter((a) => !a.isResolved);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Executive Risk Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time AI predictive analytics and decision support for infrastructure land acquisition
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-300">
            <span className="text-slate-500 font-normal">Active Dataset:</span>{' '}
            <strong className="text-blue-400">{totalProjects} Land Parcels</strong>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid (6 Metric Cards as requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          subtitle="Monitored parcels"
          icon={FolderKanban}
          colorTheme="blue"
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="High Risk Projects"
          value={highRiskCount}
          subtitle="Prob 60% - 85%"
          icon={AlertTriangle}
          colorTheme="amber"
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Critical Projects"
          value={criticalCount}
          subtitle="Immediate halt risk"
          icon={ShieldAlert}
          colorTheme="rose"
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Avg Delay Prob."
          value={`${(avgProb * 100).toFixed(1)}%`}
          subtitle="Across all sectors"
          icon={Percent}
          colorTheme="indigo"
        />
        <StatCard
          title="Avg Est. Delay"
          value={`+${avgDelayDays} Days`}
          subtitle="Projected slippage"
          icon={Clock}
          colorTheme="amber"
        />
        <StatCard
          title="Requiring Action"
          value={requiringActionCount}
          subtitle="High/Critical status"
          icon={CheckCircle2}
          colorTheme="emerald"
          onClick={() => navigate('/recommendations')}
        />
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDistributionChart projects={projects} />
        <StateProjectChart projects={projects} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistrictDelayChart projects={projects} />
        <DelayTrendChart />
      </div>

      {/* Early Warning Alerts & High Risk Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Alerts Console */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Early-Warning Alerts ({allAlerts.length})
              </h3>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {allAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No active unresolved alerts.</p>
            ) : (
              allAlerts.slice(0, 3).map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            )}
          </div>
        </div>

        {/* High Risk Projects Table Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Priority Land Acquisition Projects
            </h3>
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <ProjectTable projects={projects} />
        </div>
      </div>
    </div>
  );
};
