import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { Shield, Lock, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    navigate(from, { replace: true });
  };

  const demoAccounts: { role: UserRole; label: string; desc: string }[] = [
    { role: 'ADMIN', label: 'System Administrator', desc: 'Full access to ML models, retrain APIs, and role management' },
    { role: 'OFFICER', label: 'District Acquisition Officer', desc: 'Manage local land parcels, update statuses, execute recommendations' },
    { role: 'POLICYMAKER', label: 'NITI Aayog Policy Analyst', desc: 'View macro analytics, state delay trends, and strategic reports' },
    { role: 'VIEWER', label: 'Public Auditor / Observer', desc: 'Read-only access to published infrastructure dashboards' },
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 font-black text-white shadow-xl shadow-blue-600/30 text-xl">
            TT
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">TERRATECH</h2>
          <p className="text-xs text-slate-400">
            AI-Powered Land Acquisition Delay Detection & Decision Support Platform
          </p>
        </div>

        {/* Demo Role Switcher Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Role Demo Persona
          </label>

          <div className="space-y-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => setSelectedRole(acc.role)}
                className={`flex w-full items-start justify-between rounded-xl border p-3 text-left transition ${
                  selectedRole === acc.role
                    ? 'border-blue-600 bg-blue-950/40 shadow-md ring-1 ring-blue-600'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-white block">{acc.label}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{acc.desc}</span>
                </div>
                {selectedRole === acc.role && (
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form Submit */}
        <form onSubmit={handleLogin} className="space-y-4">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            <span>Enter Platform as {selectedRole}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Platform Status Notice */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-center text-[11px] text-slate-400">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono font-bold">
            <Cpu className="h-3.5 w-3.5" />
            <span>FastAPI Prediction Engine Online (v1.0.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
