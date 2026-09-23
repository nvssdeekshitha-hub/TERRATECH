import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Service Query Interrupted',
  message = 'Unable to fetch real-time land acquisition predictions from backend node.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-rose-900/50 bg-rose-950/20 text-center">
      <div className="rounded-full bg-rose-950 border border-rose-800 p-3 text-rose-400">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-bold text-rose-300">{title}</h3>
      <p className="mt-1 text-xs text-slate-400 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
