import React, { useEffect, useState, useMemo } from 'react';
import { LandParcel, GISFilterState, AnalyticsSummary } from '../../types/gis';
import { fetchParcels, fetchAnalytics, fetchFilterOptions } from '../../services/api';
import { TerraTechRiskMap } from '../gis/TerraTechRiskMap';
import { StateFilter } from '../gis/StateFilter';
import { DistrictFilter } from '../gis/DistrictFilter';
import { ProjectFilter } from '../gis/ProjectFilter';
import { RiskCategoryFilter } from '../gis/RiskCategoryFilter';
import { SearchBar, ResetFilter } from '../gis/SearchBar';
import { StatCards } from './StatCards';
import { ParcelDetailModal } from './ParcelDetailModal';
import { getRiskMetadata } from '../../utils/gisUtils';

// Recharts components
import { StateWiseDelayTrend } from '../charts/StateWiseDelayTrend';
import { DistrictWiseRiskDistribution } from '../charts/DistrictWiseRiskDistribution';
import { RiskCategoryDistribution } from '../charts/RiskCategoryDistribution';
import { AverageDelayDuration } from '../charts/AverageDelayDuration';
import { ProjectsByStatus } from '../charts/ProjectsByStatus';
import { TopDelayFactors } from '../charts/TopDelayFactors';
import { MonthlyDelayTrend } from '../charts/MonthlyDelayTrend';

import {
  Activity,
  Map as MapIcon,
  BarChart3,
  Table as TableIcon,
  Filter,
  Terminal,
  Database,
  RefreshCw
} from 'lucide-react';

const DEFAULT_FILTERS: GISFilterState = {
  state: 'ALL',
  district: 'ALL',
  project: 'ALL',
  riskCategory: 'ALL',
  searchQuery: ''
};

export const GISDashboard: React.FC = () => {
  const [filters, setFilters] = useState<GISFilterState>(DEFAULT_FILTERS);
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [filterOptions, setFilterOptions] = useState<{ states: string[]; districts: string[]; projects: string[] }>({
    states: [],
    districts: [],
    projects: []
  });
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);
  const [modalParcel, setModalParcel] = useState<LandParcel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'table'>('map');
  const [showApiDocs, setShowApiDocs] = useState(false);

  // Load filter options on mount
  useEffect(() => {
    fetchFilterOptions().then((opts) => setFilterOptions(opts));
  }, []);

  // Fetch data whenever filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([fetchParcels(filters), fetchAnalytics(filters)]).then(([parcelData, analyticsData]) => {
      if (isMounted) {
        setParcels(parcelData);
        setAnalytics(analyticsData);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Derived options for districts based on selected state
  const availableDistricts = useMemo(() => {
    if (filters.state === 'ALL') return filterOptions.districts;
    // Filter districts present in selected state
    const setOfDistricts = new Set(
      parcels.filter((p) => p.state === filters.state).map((p) => p.district)
    );
    return Array.from(setOfDistricts).sort();
  }, [filters.state, parcels, filterOptions.districts]);

  const isFiltered =
    filters.state !== 'ALL' ||
    filters.district !== 'ALL' ||
    filters.project !== 'ALL' ||
    filters.riskCategory !== 'ALL' ||
    filters.searchQuery.trim() !== '';

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSelectedParcel(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-12">
      {/* Top Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-[2000] backdrop-blur">
        <div className="max-w-7xl mx-mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                TerraTech <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">GIS & Visualization</span>
              </h1>
              <p className="text-xs text-slate-400">Land Acquisition Delay Detection & Spatial Risk Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Live API Status indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs font-semibold text-emerald-400">
              <Database className="w-3.5 h-3.5" />
              <span>API Ready (Mock Service)</span>
            </div>

            <button
              type="button"
              onClick={() => setShowApiDocs(!showApiDocs)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 border border-slate-700 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{showApiDocs ? 'Hide API Spec' : 'API Specs'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {/* API Specification Banner (Collapsible) */}
        {showApiDocs && (
          <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
                <Terminal className="w-4 h-4" />
                Backend API Response Signature Specification (GET /api/parcels)
              </div>
              <span className="text-xs font-mono bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-800">
                JSON Standard
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The TerraTech GIS and Visualization components consume the standard backend endpoint format:
            </p>
            <pre className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
{`GET /api/parcels
Content-Type: application/json

[
  {
    "id": "P001",
    "project": "NH-65 Expressway Expansion",
    "projectType": "Highway",
    "district": "Vijayawada",
    "state": "Andhra Pradesh",
    "landArea": 14.5,
    "affectedFamilies": 32,
    "riskScore": 82,
    "riskCategory": "HIGH",
    "delayProbability": 0.82,
    "estimatedDelayDays": 95,
    "mainDelayFactor": "Land Title Disparity & Multi-Owner Claims",
    "mainRiskFactors": ["Ancestral property dispute", "Pending high-court injunction"],
    "recommendedAction": "Initiate fast-track tribunal arbitration...",
    "acquisitionStatus": "Valuation & Award",
    "latitude": 16.5062,
    "longitude": 80.6480,
    "geojson": {
      "type": "Polygon",
      "coordinates": [[[80.636, 16.494], [80.660, 16.494], [80.660, 16.518], [80.636, 16.518], [80.636, 16.494]]]
    }
  }
]`}
            </pre>
          </div>
        )}

        {/* Global Filter Bar */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-indigo-400" />
              Spatial & Risk Filter Controls
            </div>
            {isFiltered && (
              <span className="text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2.5 py-0.5 rounded-full">
                Active Filter Applied ({parcels.length} Parcels matched)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            <StateFilter
              value={filters.state}
              options={filterOptions.states}
              onChange={(st) => setFilters((prev) => ({ ...prev, state: st, district: 'ALL' }))}
            />
            <DistrictFilter
              value={filters.district}
              options={availableDistricts}
              onChange={(dist) => setFilters((prev) => ({ ...prev, district: dist }))}
            />
            <ProjectFilter
              value={filters.project}
              options={filterOptions.projects}
              onChange={(proj) => setFilters((prev) => ({ ...prev, project: proj }))}
            />
            <RiskCategoryFilter
              value={filters.riskCategory}
              onChange={(cat) => setFilters((prev) => ({ ...prev, riskCategory: cat }))}
            />
            <SearchBar
              value={filters.searchQuery}
              onChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
            />
            <div className="flex items-center justify-end">
              <ResetFilter onReset={handleReset} disabled={!isFiltered} />
            </div>
          </div>
        </section>

        {/* KPI Summary Header */}
        {analytics && <StatCards summary={analytics} />}

        {/* GIS Interactive Map & Data Table Switcher Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'map'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Interactive GIS Risk Map
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'table'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <TableIcon className="w-4 h-4" />
                Parcel Registry ({parcels.length})
              </button>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Updating GIS Layer...
              </div>
            )}
          </div>

          {/* Map View Container */}
          {activeTab === 'map' ? (
            <TerraTechRiskMap
              parcels={parcels}
              selectedParcel={selectedParcel}
              onSelectParcel={(p) => setSelectedParcel(p)}
              onOpenFullDetail={(p) => setModalParcel(p)}
            />
          ) : (
            /* Parcel Table View */
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Project</th>
                    <th className="p-3">State / District</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">Delay Prob.</th>
                    <th className="p-3">Est. Delay</th>
                    <th className="p-3">Primary Delay Factor</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {parcels.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-500 text-xs">
                        No land parcels match the selected filter combination.
                      </td>
                    </tr>
                  ) : (
                    parcels.map((p) => {
                      const meta = getRiskMetadata(p.riskCategory);
                      return (
                        <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-mono font-bold text-indigo-300">{p.id}</td>
                          <td className="p-3 font-medium text-slate-100">{p.project}</td>
                          <td className="p-3 text-slate-400">
                            {p.district}, {p.state}
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full border text-[11px] ${meta.bgTailwind} ${meta.borderTailwind} ${meta.textTailwind}`}>
                              {meta.symbol}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-200">
                            {Math.round(p.delayProbability * 100)}%
                          </td>
                          <td className="p-3 font-semibold text-amber-300">{p.estimatedDelayDays} Days</td>
                          <td className="p-3 text-slate-400 truncate max-w-xs">{p.mainDelayFactor}</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => setModalParcel(p)}
                              className="px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-500 text-white font-semibold rounded text-[11px] transition-colors"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Analytics Layer Grid (Recharts) */}
        {analytics && (
          <section className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Spatial & Predictive Risk Analytics</h2>
              <span className="text-xs text-slate-400 font-normal">
                (Dynamically updates based on filter selections)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StateWiseDelayTrend data={analytics.stateDelayTrends} />
              <DistrictWiseRiskDistribution data={analytics.districtRiskDistributions} />
              <RiskCategoryDistribution data={analytics.riskCategoryDistributions} />
              <AverageDelayDuration data={analytics.avgDelayByProjectType} />
              <ProjectsByStatus data={analytics.projectsByStatus} />
              <TopDelayFactors data={analytics.topDelayFactors} />
            </div>

            <div className="w-full">
              <MonthlyDelayTrend data={analytics.monthlyDelayTrends} />
            </div>
          </section>
        )}
      </main>

      {/* Parcel Detail Slide-Over Drawer / Modal */}
      <ParcelDetailModal parcel={modalParcel} onClose={() => setModalParcel(null)} />
    </div>
  );
};
