import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { triggerModelRetrain } from '../services/api';
import { User, Shield, RefreshCw, Cpu, Database, Key, Server, CheckCircle2, Loader2 } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, switchRole } = useAuth();
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainMessage, setRetrainMessage] = useState<string | null>(null);

  const handleRetrainModel = async () => {
    setIsRetraining(true);
    setRetrainMessage(null);
    try {
      const response = await triggerModelRetrain(3000);
      setRetrainMessage(`Model retrained successfully! Version: ${response.model_version}. ${response.message}`);
    } catch (e: any) {
      setRetrainMessage(`Retrain error: ${e.message}`);
    } finally {
      setIsRetraining(false);
    }
  };

  const rolePermissions: Record<string, string[]> = {
    ADMIN: [
      'Full model training & artifact overwrite privileges',
      'API Key generation and system configuration',
      'User role assignment & audit trail viewing',
      'New project prediction and what-if simulation execution'
    ],
    OFFICER: [
      'District land parcel management & status updates',
      'Execute corrective recommendations & resolve alerts',
      'Run what-if predictive simulation sandbox'
    ],
    POLICYMAKER: [
      'Access state & district macro analytics dashboards',
      'Export strategic risk reduction reports',
      'View SHAP delay factor attributions'
    ],
    VIEWER: [
      'Read-only access to published infrastructure dashboards',
      'View public land acquisition risk maps'
    ]
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">User Profile & Platform Configuration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage user credentials, role permissions, API endpoints, and continuous model retraining
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="h-20 w-20 rounded-2xl border-2 border-blue-600 object-cover shadow-lg"
            />
            <div>
              <h2 className="text-lg font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
              <span className="mt-2 inline-block rounded-full bg-blue-950 px-3 py-0.5 text-xs font-bold text-blue-400 border border-blue-800">
                {user?.role} ROLE
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Department:</span>
              <strong className="text-slate-200">{user?.department}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">User ID:</span>
              <strong className="font-mono text-slate-200">{user?.id}</strong>
            </div>
          </div>
        </div>

        {/* Role Permissions Card */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="h-5 w-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Role Capabilities ({user?.role})
            </h3>
          </div>

          <ul className="space-y-2 text-xs">
            {(rolePermissions[user?.role || 'VIEWER'] || []).map((perm, idx) => (
              <li key={idx} className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{perm}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Model Retraining Architecture & Continuous Learning Section */}
      <div className="rounded-xl border border-blue-900/60 bg-slate-900 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Continuous Model Learning & Retraining Console
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Trigger background training pipeline to update Random Forest & XGBoost models with new parcel feedback datasets
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300 space-y-1">
            <p>Active Model Version: <strong className="font-mono text-emerald-400">v1.0.0</strong></p>
            <p>Target FastAPI Service: <strong className="font-mono text-blue-400">{import.meta.env.VITE_API_URL || 'http://localhost:8000'}</strong></p>
          </div>

          <button
            onClick={handleRetrainModel}
            disabled={isRetraining || user?.role !== 'ADMIN'}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition active:scale-95"
          >
            {isRetraining ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span>{isRetraining ? 'Retraining ML Models...' : 'Trigger Model Retrain (POST /retrain)'}</span>
          </button>
        </div>

        {retrainMessage && (
          <div className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-xs text-emerald-300 font-mono">
            {retrainMessage}
          </div>
        )}
      </div>
    </div>
  );
};
