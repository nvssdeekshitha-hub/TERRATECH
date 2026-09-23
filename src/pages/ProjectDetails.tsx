import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskCard } from '../components/common/RiskCard';
import { FactorList } from '../components/projects/FactorList';
import { Timeline } from '../components/projects/Timeline';
import { WhatIfSimulator } from '../components/projects/WhatIfSimulator';
import { RecommendationCard } from '../components/projects/RecommendationCard';
import { AlertCard } from '../components/projects/AlertCard';
import { ErrorState } from '../components/common/ErrorState';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  FileCheck,
  ShieldCheck,
  Scale,
  Home,
  CheckCircle2,
} from 'lucide-react';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();

  const project = getProjectById(id || '');

  if (!project) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects Repository</span>
        </button>
        <ErrorState
          title="Project Record Not Found"
          message={`No land acquisition parcel matches ID '${id}'.`}
          onRetry={() => navigate('/projects')}
        />
      </div>
    );
  }

  const statusMetrics = [
    { label: 'Documentation Status', value: `${Math.round(project.operational_status.documentation_completeness * 100)}%`, icon: FileCheck, color: 'text-blue-400' },
    { label: 'Legal Disputes Status', value: project.operational_status.legal_dispute === 1 ? 'Active Writ' : 'Clear', icon: Scale, color: project.operational_status.legal_dispute === 1 ? 'text-rose-400' : 'text-emerald-400' },
    { label: 'Compensation Disbursed', value: `${Math.round(project.operational_status.compensation_status * 100)}%`, icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Statutory Approvals', value: `${Math.round(project.operational_status.approval_status * 100)}%`, icon: ShieldCheck, color: 'text-indigo-400' },
    { label: 'R&R Rehabilitation', value: `${Math.round(project.operational_status.rehabilitation_status * 100)}%`, icon: Home, color: 'text-purple-400' },
    { label: 'Physical Possession', value: `${Math.round(project.operational_status.possession_status * 100)}%`, icon: CheckCircle2, color: 'text-teal-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Navigation */}
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Projects Repository</span>
      </button>

      {/* Project Header Info Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                {project.id}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {project.project_type}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">{project.name}</h1>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                {project.district}, {project.state}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                Target: {project.target_completion_date}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RiskBadge
              category={project.prediction?.risk_category || 'LOW'}
              score={project.prediction?.risk_score}
              size="lg"
            />
          </div>
        </div>

        {/* Basic Metadata Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Land Area</span>
            <span className="text-base font-extrabold font-mono text-white">
              {project.land_area_acres} Acres
            </span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Affected Families</span>
            <span className="text-base font-extrabold font-mono text-white">
              {project.affected_families} Families
            </span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Project Budget</span>
            <span className="text-base font-extrabold font-mono text-emerald-400">
              ₹{project.budget_crores} Cr
            </span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated Delay</span>
            <span className="text-base font-extrabold font-mono text-amber-400">
              +{project.prediction?.estimated_delay_days || 0} Days
            </span>
          </div>
        </div>
      </div>

      {/* Operational Indicators Breakdown Grid */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
          Land Acquisition Operational Indicators
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statusMetrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`h-4 w-4 ${m.color}`} />
                  <span className="text-[10px] font-bold text-slate-400 leading-tight">{m.label}</span>
                </div>
                <span className="text-lg font-black font-mono text-white">{m.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Section: Risk Card + SHAP Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RiskCard
          score={project.prediction?.risk_score || 0}
          category={project.prediction?.risk_category || 'LOW'}
          delayProbability={project.prediction?.delay_probability || 0}
          estimatedDelayDays={project.prediction?.estimated_delay_days || 0}
          projectName={project.name}
          projectId={project.id}
        />

        <div className="lg:col-span-2">
          <FactorList factors={project.prediction?.delay_factors || []} />
        </div>
      </div>

      {/* What-If Predictive Simulation Sandbox */}
      <WhatIfSimulator project={project} />

      {/* Timeline & Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Timeline milestones={project.milestones || []} />

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            AI Prescriptive Corrective Recommendations
          </h3>
          <div className="space-y-3">
            {project.recommendations && project.recommendations.length > 0 ? (
              project.recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))
            ) : (
              <p className="text-xs text-slate-500">No active corrective recommendations required.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
