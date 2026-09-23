import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Evaluating land acquisition predictive models...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-slate-800 bg-slate-900/60 text-center">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      <p className="mt-4 text-sm font-semibold text-slate-300">{message}</p>
      <p className="mt-1 text-xs text-slate-500 font-mono">TerraTech AI Engine v1.0.0</p>
    </div>
  );
};
