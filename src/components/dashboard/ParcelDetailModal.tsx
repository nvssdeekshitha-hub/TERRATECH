import React, { useState } from 'react';
import { LandParcel } from '../../types/gis';
import { getRiskMetadata, formatAcres, formatDays, formatProbability } from '../../utils/gisUtils';
import { X, MapPin, AlertTriangle, CheckCircle2, FileText, Scale, Users, Code } from 'lucide-react';

interface ParcelDetailModalProps {
  parcel: LandParcel | null;
  onClose: () => void;
}

export const ParcelDetailModal: React.FC<ParcelDetailModalProps> = ({ parcel, onClose }) => {
  const [showJson, setShowJson] = useState(false);

  if (!parcel) return null;

  const meta = getRiskMetadata(parcel.riskCategory);

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950/80 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2.5 py-1 rounded">
                Parcel #{parcel.id}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${meta.bgTailwind} ${meta.borderTailwind} ${meta.textTailwind}`}>
                {meta.symbol} ({parcel.riskScore}/100)
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1">{parcel.project}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              {parcel.tehsilVillage ? `${parcel.tehsilVillage}, ` : ''}{parcel.district}, {parcel.state}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="Toggle JSON API Payload View"
            >
              <Code className="w-4 h-4" />
              <span>{showJson ? 'UI View' : 'API JSON'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {showJson ? (
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto">
              <pre>{JSON.stringify(parcel, null, 2)}</pre>
            </div>
          ) : (
            <>
              {/* Primary Risk & Delay Banner */}
              <div className={`p-4 rounded-xl border ${meta.bgTailwind} ${meta.borderTailwind} grid grid-cols-3 gap-3 text-center`}>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Risk Score</span>
                  <span className={`text-2xl font-black ${meta.textTailwind}`}>{parcel.riskScore}<span className="text-xs text-slate-400 font-normal">/100</span></span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Delay Probability</span>
                  <span className={`text-2xl font-black ${meta.textTailwind}`}>{formatProbability(parcel.delayProbability)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Est. Delay Duration</span>
                  <span className="text-2xl font-black text-slate-100">{formatDays(parcel.estimatedDelayDays)}</span>
                </div>
              </div>

              {/* Acquisition Status & Attributes */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Acquisition Status & Parcel Attributes
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                    <span className="text-slate-400 block text-[11px]">Current Lifecycle Stage</span>
                    <span className="font-semibold text-indigo-300 text-sm mt-0.5 block">{parcel.acquisitionStatus}</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                    <span className="text-slate-400 block text-[11px]">Land Area</span>
                    <span className="font-semibold text-slate-200 text-sm mt-0.5 block">{formatAcres(parcel.landArea)}</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-400" />
                      Affected Families
                    </span>
                    <span className="font-semibold text-slate-200 text-sm mt-0.5 block">{parcel.affectedFamilies} Households</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                    <span className="text-slate-400 block text-[11px]">Ownership Structure</span>
                    <span className="font-semibold text-slate-200 text-sm mt-0.5 block">{parcel.ownershipComplexity}</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <FileText className="w-3 h-3 text-indigo-400" />
                      Documentation Status
                    </span>
                    <span className="font-semibold text-slate-200 text-sm mt-0.5 block">{parcel.documentationStatus}</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <Scale className="w-3 h-3 text-rose-400" />
                      Legal Disputes Count
                    </span>
                    <span className="font-semibold text-rose-400 text-sm mt-0.5 block">{parcel.legalDisputesCount} Active Disputes</span>
                  </div>
                </div>
              </div>

              {/* Detailed Explainable AI Delay Factors */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Primary Delay Factors (SHAP Feature Importance)
                </h3>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs font-semibold text-amber-300">
                    Main Cause: {parcel.mainDelayFactor}
                  </div>
                  <div className="space-y-2">
                    {parcel.mainRiskFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corrective Action Recommendations */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  AI Recommended Corrective Interventions
                </h3>
                <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4 text-xs text-emerald-200 leading-relaxed font-medium">
                  {parcel.recommendedAction}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 sticky bottom-0 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
