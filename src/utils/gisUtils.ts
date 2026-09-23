import { RiskCategory } from '../types/gis';

export interface RiskMeta {
  category: RiskCategory;
  label: string;
  color: string;
  bgTailwind: string;
  borderTailwind: string;
  textTailwind: string;
  badgeClass: string;
  symbol: string; // Accessibility symbol
  shapeName: string;
  ariaLabel: string;
}

export function getRiskMetadata(category: RiskCategory): RiskMeta {
  switch (category) {
    case 'LOW':
      return {
        category: 'LOW',
        label: 'Low Risk',
        color: '#10B981',
        bgTailwind: 'bg-emerald-500/15',
        borderTailwind: 'border-emerald-500/30',
        textTailwind: 'text-emerald-400',
        badgeClass: 'risk-low',
        symbol: '✓ LOW',
        shapeName: 'Circle Check',
        ariaLabel: 'Low risk status, level 1 of 4'
      };
    case 'MEDIUM':
      return {
        category: 'MEDIUM',
        label: 'Medium Risk',
        color: '#F59E0B',
        bgTailwind: 'bg-amber-500/15',
        borderTailwind: 'border-amber-500/30',
        textTailwind: 'text-amber-400',
        badgeClass: 'risk-medium',
        symbol: '▲ MED',
        shapeName: 'Warning Triangle',
        ariaLabel: 'Medium risk status, level 2 of 4'
      };
    case 'HIGH':
      return {
        category: 'HIGH',
        label: 'High Risk',
        color: '#F97316',
        bgTailwind: 'bg-orange-500/15',
        borderTailwind: 'border-orange-500/30',
        textTailwind: 'text-orange-400',
        badgeClass: 'risk-high',
        symbol: '◆ HIGH',
        shapeName: 'Diamond Exclamation',
        ariaLabel: 'High risk status, level 3 of 4'
      };
    case 'CRITICAL':
      return {
        category: 'CRITICAL',
        label: 'Critical Risk',
        color: '#EF4444',
        bgTailwind: 'bg-rose-500/20',
        borderTailwind: 'border-rose-500/40',
        textTailwind: 'text-rose-400',
        badgeClass: 'risk-critical',
        symbol: '⯁ CRIT!',
        shapeName: 'Pulsing Octagon',
        ariaLabel: 'Critical risk status, level 4 of 4'
      };
  }
}

export function formatAcres(acres: number): string {
  return `${acres.toLocaleString('en-IN', { maximumFractionDigits: 1 })} Acres`;
}

export function formatDays(days: number): string {
  return `${days} Days`;
}

export function formatProbability(prob: number): string {
  return `${Math.round(prob * 100)}%`;
}
