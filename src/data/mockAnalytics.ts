import { LandParcel, AnalyticsSummary, StateDelayTrendItem, DistrictRiskDistributionItem, RiskCategoryDistributionItem, AverageDelayDurationItem, ProjectsByStatusItem, TopDelayFactorItem, MonthlyDelayTrendItem } from '../types/gis';

export function calculateAnalyticsFromParcels(parcels: LandParcel[]): AnalyticsSummary {
  const totalParcels = parcels.length;
  if (totalParcels === 0) {
    return {
      totalParcels: 0,
      highRiskCount: 0,
      criticalRiskCount: 0,
      avgDelayDays: 0,
      totalLandAreaAcres: 0,
      totalAffectedFamilies: 0,
      stateDelayTrends: [],
      districtRiskDistributions: [],
      riskCategoryDistributions: [],
      avgDelayByProjectType: [],
      projectsByStatus: [],
      topDelayFactors: [],
      monthlyDelayTrends: []
    };
  }

  const highRiskCount = parcels.filter(p => p.riskCategory === 'HIGH').length;
  const criticalRiskCount = parcels.filter(p => p.riskCategory === 'CRITICAL').length;
  const totalDelayDays = parcels.reduce((sum, p) => sum + p.estimatedDelayDays, 0);
  const avgDelayDays = Math.round(totalDelayDays / totalParcels);
  const totalLandAreaAcres = Math.round(parcels.reduce((sum, p) => sum + p.landArea, 0) * 10) / 10;
  const totalAffectedFamilies = parcels.reduce((sum, p) => sum + p.affectedFamilies, 0);

  // 1. State-wise delay trend
  const stateMap: Record<string, { totalDelay: number; highRisk: number; count: number }> = {};
  parcels.forEach(p => {
    if (!stateMap[p.state]) {
      stateMap[p.state] = { totalDelay: 0, highRisk: 0, count: 0 };
    }
    stateMap[p.state].totalDelay += p.estimatedDelayDays;
    if (p.riskCategory === 'HIGH' || p.riskCategory === 'CRITICAL') {
      stateMap[p.state].highRisk += 1;
    }
    stateMap[p.state].count += 1;
  });

  const stateDelayTrends: StateDelayTrendItem[] = Object.entries(stateMap).map(([state, data]) => ({
    state,
    avgDelayDays: Math.round(data.totalDelay / data.count),
    highRiskParcels: data.highRisk,
    totalParcels: data.count
  }));

  // 2. District-wise risk distribution
  const districtMap: Record<string, { low: number; medium: number; high: number; critical: number }> = {};
  parcels.forEach(p => {
    if (!districtMap[p.district]) {
      districtMap[p.district] = { low: 0, medium: 0, high: 0, critical: 0 };
    }
    if (p.riskCategory === 'LOW') districtMap[p.district].low += 1;
    if (p.riskCategory === 'MEDIUM') districtMap[p.district].medium += 1;
    if (p.riskCategory === 'HIGH') districtMap[p.district].high += 1;
    if (p.riskCategory === 'CRITICAL') districtMap[p.district].critical += 1;
  });

  const districtRiskDistributions: DistrictRiskDistributionItem[] = Object.entries(districtMap).map(
    ([district, counts]) => ({
      district,
      ...counts
    })
  );

  // 3. Risk category distribution
  const categoryCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  parcels.forEach(p => {
    categoryCounts[p.riskCategory] += 1;
  });

  const colorMap = {
    LOW: '#10B981',
    MEDIUM: '#F59E0B',
    HIGH: '#F97316',
    CRITICAL: '#EF4444'
  };

  const riskCategoryDistributions: RiskCategoryDistributionItem[] = (
    ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const
  ).map(cat => ({
    name: cat,
    count: categoryCounts[cat],
    percentage: Math.round((categoryCounts[cat] / totalParcels) * 100),
    color: colorMap[cat]
  }));

  // 4. Average delay duration by Project Type
  const typeMap: Record<string, { total: number; max: number; count: number }> = {};
  parcels.forEach(p => {
    if (!typeMap[p.projectType]) {
      typeMap[p.projectType] = { total: 0, max: 0, count: 0 };
    }
    typeMap[p.projectType].total += p.estimatedDelayDays;
    if (p.estimatedDelayDays > typeMap[p.projectType].max) {
      typeMap[p.projectType].max = p.estimatedDelayDays;
    }
    typeMap[p.projectType].count += 1;
  });

  const avgDelayByProjectType: AverageDelayDurationItem[] = Object.entries(typeMap).map(([type, data]) => ({
    projectType: type,
    avgDays: Math.round(data.total / data.count),
    maxDays: data.max
  }));

  // 5. Projects by acquisition status
  const statusMap: Record<string, number> = {};
  parcels.forEach(p => {
    statusMap[p.acquisitionStatus] = (statusMap[p.acquisitionStatus] || 0) + 1;
  });

  const projectsByStatus: ProjectsByStatusItem[] = Object.entries(statusMap).map(([status, count]) => ({
    status,
    count,
    percentage: Math.round((count / totalParcels) * 100)
  }));

  // 6. Top delay factors
  const factorMap: Record<string, { count: number; riskSum: number }> = {};
  parcels.forEach(p => {
    const factor = p.mainDelayFactor;
    if (!factorMap[factor]) {
      factorMap[factor] = { count: 0, riskSum: 0 };
    }
    factorMap[factor].count += 1;
    factorMap[factor].riskSum += p.riskScore;
  });

  const topDelayFactors: TopDelayFactorItem[] = Object.entries(factorMap)
    .map(([factor, data]) => ({
      factor,
      count: data.count,
      impactScore: Math.round(data.riskSum / data.count)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // 7. Monthly delay trend (synthetic history over last 6 months)
  const monthlyDelayTrends: MonthlyDelayTrendItem[] = [
    { month: 'Apr 2026', predictedDelayDays: Math.round(avgDelayDays * 0.7), actualDelayDays: Math.round(avgDelayDays * 0.65), affectedAcres: Math.round(totalLandAreaAcres * 0.5) },
    { month: 'May 2026', predictedDelayDays: Math.round(avgDelayDays * 0.78), actualDelayDays: Math.round(avgDelayDays * 0.72), affectedAcres: Math.round(totalLandAreaAcres * 0.6) },
    { month: 'Jun 2026', predictedDelayDays: Math.round(avgDelayDays * 0.85), actualDelayDays: Math.round(avgDelayDays * 0.8), affectedAcres: Math.round(totalLandAreaAcres * 0.7) },
    { month: 'Jul 2026', predictedDelayDays: Math.round(avgDelayDays * 0.92), actualDelayDays: Math.round(avgDelayDays * 0.88), affectedAcres: Math.round(totalLandAreaAcres * 0.85) },
    { month: 'Aug 2026', predictedDelayDays: Math.round(avgDelayDays * 0.96), actualDelayDays: Math.round(avgDelayDays * 0.95), affectedAcres: Math.round(totalLandAreaAcres * 0.92) },
    { month: 'Sep 2026', predictedDelayDays: avgDelayDays, actualDelayDays: avgDelayDays, affectedAcres: totalLandAreaAcres }
  ];

  return {
    totalParcels,
    highRiskCount,
    criticalRiskCount,
    avgDelayDays,
    totalLandAreaAcres,
    totalAffectedFamilies,
    stateDelayTrends,
    districtRiskDistributions,
    riskCategoryDistributions,
    avgDelayByProjectType,
    projectsByStatus,
    topDelayFactors,
    monthlyDelayTrends
  };
}
