import React from 'react';
import { LandParcel } from '../../types/gis';
import { getRiskMetadata, formatAcres, formatDays, formatProbability } from '../../utils/gisUtils';
import { AlertTriangle, Clock, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

interface RiskPopupProps {
  parcel: LandParcel;
  onOpenFullDetail?: (parcel: LandParcel) => void;
}

export const RiskPopup: React.FC<RiskPopupProps> = ({ parcel, onOpenFullDetail }) => {
  const meta = getRiskMetadata(parcel.riskCategory);

  return (
    <div className="p-4 max-w-sm font-sans text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded">
              {parcel.id}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${meta.bgTailwind} ${meta.borderTailwind} ${meta.textTailwind}`}
              aria-label={meta.ariaLabel}
            >
              <span>{meta.symbol}</span>
              <span>({parcel.riskScore}/100)</span>
            </span>
          </div>
          <h3 className="font-semibold text-slate-100 text-sm mt-1 line-clamp-1" title={parcel.project}>
            {parcel.project}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
            {parcel.district}, {parcel.state}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 my-3">
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Land Area</span>
          <span className="text-xs font-semibold text-slate-200">{formatAcres(parcel.landArea)}</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Delay Prob.</span>
          <span className={`text-xs font-semibold ${meta.textTailwind}`}>
            {formatProbability(parcel.delayProbability)}
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Est. Delay</span>
          <span className="text-xs font-semibold text-slate-200 flex items-center justify-center gap-0.5">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatDays(parcel.estimatedDelayDays)}
          </span>
        </div>
      </div>

      {/* Main Risk Factors */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Main Risk Factors
        </h4>
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-lg p-2 text-xs space-y-1">
          <p className="font-medium text-amber-300/90">{parcel.mainDelayFactor}</p>
          <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5 mt-1">
            {parcel.mainRiskFactors.slice(0, 2).map((factor, idx) => (
              <li key={idx} className="line-clamp-1">{factor}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Action */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Recommended Action
        </h4>
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-lg p-2 text-xs text-emerald-200/90 leading-relaxed">
          {parcel.recommendedAction}
        </div>
      </div>

      {/* Action Footer */}
      {onOpenFullDetail && (
        <button
          type="button"
          onClick={() => onOpenFullDetail(parcel)}
          className="w-full mt-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm"
        >
          View Full Parcel Analytics
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
