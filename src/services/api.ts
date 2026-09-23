import { LandParcel, GISFilterState, AnalyticsSummary } from '../types/gis';
import { MOCK_PARCELS } from '../data/mockParcels';
import { calculateAnalyticsFromParcels } from '../data/mockAnalytics';

/**
 * TerraTech GIS API Client Service
 * Serves as an interface connecting React GIS & Analytics components to backend APIs.
 * Currently uses mock data with realistic response latency.
 */

// Simulated network delay (ms)
const API_DELAY_MS = 150;

export async function fetchParcels(filters?: Partial<GISFilterState>): Promise<LandParcel[]> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));

  let filtered = [...MOCK_PARCELS];

  if (filters) {
    if (filters.state && filters.state !== 'ALL') {
      filtered = filtered.filter(p => p.state === filters.state);
    }
    if (filters.district && filters.district !== 'ALL') {
      filtered = filtered.filter(p => p.district === filters.district);
    }
    if (filters.project && filters.project !== 'ALL') {
      filtered = filtered.filter(p => p.project === filters.project);
    }
    if (filters.riskCategory && filters.riskCategory !== 'ALL') {
      filtered = filtered.filter(p => p.riskCategory === filters.riskCategory);
    }
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.id.toLowerCase().includes(q) ||
        p.project.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.mainDelayFactor.toLowerCase().includes(q)
      );
    }
  }

  return filtered;
}

export async function fetchParcelById(id: string): Promise<LandParcel | null> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));
  const found = MOCK_PARCELS.find(p => p.id === id);
  return found || null;
}

export async function fetchAnalytics(filters?: Partial<GISFilterState>): Promise<AnalyticsSummary> {
  const parcels = await fetchParcels(filters);
  return calculateAnalyticsFromParcels(parcels);
}

export async function fetchFilterOptions(): Promise<{
  states: string[];
  districts: string[];
  projects: string[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const states = Array.from(new Set(MOCK_PARCELS.map(p => p.state))).sort();
  const districts = Array.from(new Set(MOCK_PARCELS.map(p => p.district))).sort();
  const projects = Array.from(new Set(MOCK_PARCELS.map(p => p.project))).sort();

  return { states, districts, projects };
}
