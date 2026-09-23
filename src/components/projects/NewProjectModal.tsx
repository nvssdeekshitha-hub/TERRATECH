import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { X, Plus, Sparkles, Loader2 } from 'lucide-react';

interface NewProjectModalProps {
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose }) => {
  const { addNewProject, isLoading } = useProjects();

  const [formData, setFormData] = useState({
    name: '',
    project_type: 'Highways',
    state: 'Maharashtra',
    district: 'Pune',
    land_area_acres: 120,
    affected_families: 65,
    budget_crores: 450,
    target_completion_date: '2027-12-31',
    ownership_complexity: 0.6,
    documentation_completeness: 0.7,
    legal_dispute: 1,
    compensation_status: 0.5,
    approval_status: 0.4,
    rehabilitation_status: 0.5,
    possession_status: 0.3,
    stakeholder_responsiveness: 0.6,
    administrative_processing_days: 180,
    historical_delay_rate: 0.35,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNewProject({
      name: formData.name || `Land Parcel ${formData.district} Section 11`,
      project_type: formData.project_type,
      state: formData.state,
      district: formData.district,
      land_area_acres: Number(formData.land_area_acres),
      affected_families: Number(formData.affected_families),
      budget_crores: Number(formData.budget_crores),
      target_completion_date: formData.target_completion_date,
      operational_status: {
        ownership_complexity: Number(formData.ownership_complexity),
        documentation_completeness: Number(formData.documentation_completeness),
        legal_dispute: Number(formData.legal_dispute),
        compensation_status: Number(formData.compensation_status),
        approval_status: Number(formData.approval_status),
        rehabilitation_status: Number(formData.rehabilitation_status),
        possession_status: Number(formData.possession_status),
        stakeholder_responsiveness: Number(formData.stakeholder_responsiveness),
        administrative_processing_days: Number(formData.administrative_processing_days),
        historical_delay_rate: Number(formData.historical_delay_rate),
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600/20 p-2 text-blue-400 border border-blue-600/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">New Land Acquisition Risk Prediction</h3>
              <p className="text-xs text-slate-400">Run real-time ML delay probability & SHAP risk factor analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          {/* General Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Pune-Ring Road Western Bypass Parcel A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Type</label>
              <select
                value={formData.project_type}
                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-600 focus:outline-none"
              >
                <option value="Highways">Highways</option>
                <option value="Railways">Railways</option>
                <option value="Solar Parks">Solar Parks</option>
                <option value="Mining">Mining</option>
                <option value="Urban Infrastructure">Urban Infrastructure</option>
                <option value="Industrial Corridors">Industrial Corridors</option>
                <option value="Water Resources">Water Resources</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">State & District</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="District"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Land Area (Acres)</label>
              <input
                type="number"
                min="1"
                value={formData.land_area_acres}
                onChange={(e) => setFormData({ ...formData, land_area_acres: parseFloat(e.target.value) })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Affected Families</label>
              <input
                type="number"
                min="0"
                value={formData.affected_families}
                onChange={(e) => setFormData({ ...formData, affected_families: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Operational Status Feature Controls */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Land Acquisition Feature Indicators (ML Inputs)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">
                  Active Court/Legal Dispute: <strong>{formData.legal_dispute === 1 ? 'YES (1)' : 'NO (0)'}</strong>
                </label>
                <select
                  value={formData.legal_dispute}
                  onChange={(e) => setFormData({ ...formData, legal_dispute: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                >
                  <option value={1}>Yes - Active Dispute (1)</option>
                  <option value={0}>No Legal Dispute (0)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  Documentation Completeness: <strong>{Math.round(formData.documentation_completeness * 100)}%</strong>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={formData.documentation_completeness}
                  onChange={(e) => setFormData({ ...formData, documentation_completeness: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  Ownership Complexity: <strong>{Math.round(formData.ownership_complexity * 100)}%</strong>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={formData.ownership_complexity}
                  onChange={(e) => setFormData({ ...formData, ownership_complexity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  Compensation Disbursement: <strong>{Math.round(formData.compensation_status * 100)}%</strong>
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={formData.compensation_status}
                  onChange={(e) => setFormData({ ...formData, compensation_status: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  Statutory Approvals: <strong>{Math.round(formData.approval_status * 100)}%</strong>
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={formData.approval_status}
                  onChange={(e) => setFormData({ ...formData, approval_status: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  Administrative Days Elapsed: <strong>{formData.administrative_processing_days} Days</strong>
                </label>
                <input
                  type="number"
                  min="30"
                  max="365"
                  value={formData.administrative_processing_days}
                  onChange={(e) => setFormData({ ...formData, administrative_processing_days: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 disabled:opacity-50 transition"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span>{isLoading ? 'Running ML Inference...' : 'Predict & Add Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
