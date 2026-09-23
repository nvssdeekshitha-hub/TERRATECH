import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { UserRole } from '../../types/auth';
import {
  Shield,
  Search,
  Plus,
  Activity,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Sliders,
  Cpu,
} from 'lucide-react';
import { NewProjectModal } from '../projects/NewProjectModal';

export const Header: React.FC = () => {
  const { user, switchRole, logout } = useAuth();
  const { searchQuery, setSearchQuery, systemHealth } = useProjects();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const roles: UserRole[] = ['ADMIN', 'OFFICER', 'POLICYMAKER', 'VIEWER'];

  const roleColors: Record<UserRole, string> = {
    ADMIN: 'bg-rose-950 text-rose-300 border-rose-800',
    OFFICER: 'bg-blue-950 text-blue-300 border-blue-800',
    POLICYMAKER: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    VIEWER: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/95 px-6 shadow-md backdrop-blur-md">
        {/* Left Section: Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by ID, state, district, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Right Section: Actions, Health, & User Role Menu */}
        <div className="flex items-center gap-4">
          {/* ML System Health Indicator */}
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs">
            <Cpu className={`h-3.5 w-3.5 ${systemHealth?.isSimulated ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className="text-slate-400 font-medium">ML Service:</span>
            <span className={`font-mono font-bold ${systemHealth?.isSimulated ? 'text-amber-400' : 'text-emerald-400'}`}>
              {systemHealth?.isSimulated ? 'Client Standby' : 'FastAPI Active'}
            </span>
          </div>

          {/* New Prediction Button */}
          <button
            onClick={() => setIsNewProjectOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Prediction</span>
          </button>

          {/* Role Switcher & Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950/80 p-1.5 pr-3 transition hover:border-slate-700"
            >
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name}
                className="h-7 w-7 rounded-full border border-slate-700 object-cover"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">{user?.department}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
                <div className="border-b border-slate-800 pb-2 px-2">
                  <p className="text-xs font-bold text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-400">{user?.email}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Active Role:</span>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${roleColors[user?.role || 'VIEWER']}`}>
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Switch Role (Demo Mode)
                  </p>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs text-left transition ${
                        user?.role === r ? 'bg-slate-800 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{r}</span>
                      {user?.role === r && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-2">
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* New Project Prediction Modal */}
      {isNewProjectOpen && (
        <NewProjectModal onClose={() => setIsNewProjectOpen(false)} />
      )}
    </>
  );
};
