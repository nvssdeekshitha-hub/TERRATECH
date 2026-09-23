import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  MapPin,
  Bell,
  CheckSquare,
  BarChart3,
  User,
  Activity,
  Database,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { projects } = useProjects();

  const totalAlerts = projects.reduce((acc, p) => acc + p.alerts.filter((a) => !a.isResolved).length, 0);
  const criticalCount = projects.filter((p) => p.prediction?.risk_category === 'CRITICAL').length;

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban, badge: projects.length },
    { label: 'Risk Analysis', path: '/risk-analysis', icon: ShieldAlert, badge: criticalCount > 0 ? criticalCount : undefined, badgeColor: 'bg-rose-600' },
    { label: 'GIS Risk Map', path: '/map', icon: MapPin },
    { label: 'Alerts', path: '/alerts', icon: Bell, badge: totalAlerts > 0 ? totalAlerts : undefined, badgeColor: 'bg-amber-600' },
    { label: 'Recommendations', path: '/recommendations', icon: CheckSquare },
    { label: 'Macro Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'User Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-300">
      {/* Platform Branding Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 font-black text-white shadow-lg shadow-blue-600/20">
          TT
        </div>
        <div>
          <h1 className="text-sm font-black tracking-wider text-white">TERRATECH</h1>
          <p className="text-[10px] font-mono tracking-wide text-blue-400">AI DELAY INTELLIGENCE</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Main Console
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-600/30 font-bold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 transition group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold text-white shadow-sm ${
                    item.badgeColor || 'bg-slate-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer System Status Banner */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</span>
            <span className="rounded px-1.5 py-0.5 text-[10px] font-mono font-extrabold bg-blue-950 text-blue-400 border border-blue-800">
              {user?.role}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-300 font-semibold truncate">{user?.department}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ML Engine Model v1.0.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
