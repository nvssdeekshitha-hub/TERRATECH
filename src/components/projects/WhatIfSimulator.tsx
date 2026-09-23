import React, { useState } from 'react';
import { Project, OperationalStatus } from '../../types/project';
import { useProjects } from '../../context/ProjectContext';
import { Sliders, RefreshCw, Zap, TrendingDown, ArrowRight } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface WhatIfSimulatorProps {
  project: Project;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ project }) => {
  const { repredictProject, isLoading } = useProjects();
  const [params, setParams] = useState<OperationalStatus>({ ...project.operational_status });
  const [simulatedResult, setSimulatedResult] = useState<any>(project.prediction || null);
  const [isSimulated, setIsSimulated] = useState(false);

  const handleSliderChange = (key: keyof OperationalStatus, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleRunSimulation = async () => {
    const updated = await repredictProject(project.id, params);
    if (updated.prediction) {
      setSimulatedResult(updated.prediction);
      setIsSimulated(true);
    }
  };

  const resetParams = () => {
    setParams({ ...project.operational_status });
    setSimulatedResult(project.prediction || null);
    setIsSimulated(false);
  };

  const baselineScore = project.prediction?.risk_score ?? 0;
  const newScore = simulatedResult?.risk_score ?? baselineScore;
  const scoreDiff = baselineScore - newScore;

  return (
    <div className="rounded-xl border border-blue-900/60 bg-slate-900 p-6 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              What-If Predictive Simulation Sandbox
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate administrative interventions (resolving disputes, accelerating clearances, increasing compensation) and query ML model for instant risk score changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetParams}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
          >
            Reset Indicators
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 disabled:opacity-50 transition active:scale-95"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Running ML Model...' : 'Simulate Prediction'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
          {/* Legal Dispute Toggle */}
          <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-3">
            <div>
              <span className="text-xs font-bold text-white">Active Court / Legal Dispute</span>
              <p className="text-[10px] text-slate-400">Toggle active writ petitions or court stays</p>
            </div>
            <button
              onClick={() => handleSliderChange('legal_dispute', params.legal_dispute === 1 ? 0 : 1)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition border ${
                params.legal_dispute === 1
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}
            >
              {params.legal_dispute === 1 ? 'ACTIVE DISPUTE (1)' : 'NO DISPUTE (0)'}
            </button>
          </div>

          {/* Slider 1: Documentation Completeness */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Documentation Completeness</span>
              <span className="font-mono font-bold text-blue-400">{Math.round(params.documentation_completeness * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={params.documentation_completeness}
              onChange={(e) => handleSliderChange('documentation_completeness', parseFloat(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 2: Ownership Complexity */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Ownership Complexity</span>
              <span className="font-mono font-bold text-amber-400">{Math.round(params.ownership_complexity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={params.ownership_complexity}
              onChange={(e) => handleSliderChange('ownership_complexity', parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 3: Compensation Status */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Compensation Disbursement</span>
              <span className="font-mono font-bold text-emerald-400">{Math.round(params.compensation_status * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={params.compensation_status}
              onChange={(e) => handleSliderChange('compensation_status', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 4: Approval Status */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Statutory Approvals</span>
              <span className="font-mono font-bold text-indigo-400">{Math.round(params.approval_status * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={params.approval_status}
              onChange={(e) => handleSliderChange('approval_status', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 5: Rehabilitation Status */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>R&R Resettlement Progress</span>
              <span className="font-mono font-bold text-purple-400">{Math.round(params.rehabilitation_status * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={params.rehabilitation_status}
              onChange={(e) => handleSliderChange('rehabilitation_status', parseFloat(e.target.value))}
              className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 6: Possession Status */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Physical Land Possession</span>
              <span className="font-mono font-bold text-teal-400">{Math.round(params.possession_status * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={params.possession_status}
              onChange={(e) => handleSliderChange('possession_status', parseFloat(e.target.value))}
              className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Live ML Prediction Comparison Output Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Simulation Results Comparison
            </h4>

            <div className="mt-4 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">BASELINE RISK</span>
                <span className="text-2xl font-black font-mono text-slate-300">{baselineScore}</span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600" />
              <div>
                <span className="text-[10px] text-blue-400 font-bold block">SIMULATED RISK</span>
                <span className="text-3xl font-black font-mono text-white">{newScore}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <RiskBadge category={simulatedResult?.risk_category || 'LOW'} score={newScore} size="lg" />
            </div>

            {isSimulated && scoreDiff > 0 && (
              <div className="mt-4 rounded-lg border border-emerald-800/60 bg-emerald-950/40 p-3 flex items-center gap-2 text-xs text-emerald-400">
                <TrendingDown className="h-4 w-4 shrink-0" />
                <span>Interventions reduce risk score by <strong>-{scoreDiff} points</strong>!</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Predicted Delay:</span>
              <strong className="text-amber-400">+{simulatedResult?.estimated_delay_days ?? 0} Days</strong>
            </div>
            <div className="flex justify-between mt-1">
              <span>Delay Propensity:</span>
              <strong className="text-white">
                {((simulatedResult?.delay_probability ?? 0) * 100).toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
