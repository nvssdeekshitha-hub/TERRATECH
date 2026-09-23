import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectStatus, Alert, Recommendation, OperationalStatus } from '../types/project';
import { INITIAL_PROJECTS } from '../services/mockData';
import { predictDelay, checkHealth } from '../services/api';
import { PredictionRequest } from '../types/predict';

interface ProjectContextType {
  projects: Project[];
  filteredProjects: Project[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedProjectType: string;
  setSelectedProjectType: (ptype: string) => void;
  isLoading: boolean;
  systemHealth: { status: string; service: string; isSimulated?: boolean } | null;
  
  // Actions
  getProjectById: (id: string) => Project | undefined;
  addNewProject: (projectData: Partial<Project> & { operational_status: OperationalStatus }) => Promise<Project>;
  updateProjectStatus: (id: string, status: ProjectStatus) => void;
  repredictProject: (id: string, updatedOperationalStatus: OperationalStatus) => Promise<Project>;
  resolveAlert: (alertId: string) => void;
  updateRecommendationStatus: (recId: string, newStatus: 'PROPOSED' | 'IN_IMPLEMENTATION' | 'RESOLVED') => void;
  resetFilters: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('terratech_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PROJECTS;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('terratech_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    checkHealth().then(health => setSystemHealth(health));
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedState === 'ALL' || p.state === selectedState;
    const matchesDistrict = selectedDistrict === 'ALL' || p.district === selectedDistrict;
    const matchesCategory = selectedCategory === 'ALL' || (p.prediction && p.prediction.risk_category === selectedCategory);
    const matchesProjectType = selectedProjectType === 'ALL' || p.project_type === selectedProjectType;

    return matchesSearch && matchesState && matchesDistrict && matchesCategory && matchesProjectType;
  });

  const getProjectById = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  const addNewProject = async (
    projectData: Partial<Project> & { operational_status: OperationalStatus }
  ): Promise<Project> => {
    setIsLoading(true);
    try {
      const payload: PredictionRequest = {
        project_type: projectData.project_type || 'Highways',
        state: projectData.state || 'Maharashtra',
        district: projectData.district || 'Pune',
        land_area_acres: Number(projectData.land_area_acres) || 100,
        affected_families: Number(projectData.affected_families) || 50,
        ownership_complexity: Number(projectData.operational_status.ownership_complexity),
        documentation_completeness: Number(projectData.operational_status.documentation_completeness),
        legal_dispute: Number(projectData.operational_status.legal_dispute),
        compensation_status: Number(projectData.operational_status.compensation_status),
        approval_status: Number(projectData.operational_status.approval_status),
        rehabilitation_status: Number(projectData.operational_status.rehabilitation_status),
        possession_status: Number(projectData.operational_status.possession_status),
        stakeholder_responsiveness: Number(projectData.operational_status.stakeholder_responsiveness),
        administrative_processing_days: Number(projectData.operational_status.administrative_processing_days),
        historical_delay_rate: Number(projectData.operational_status.historical_delay_rate)
      };

      // Query ML prediction API
      const prediction = await predictDelay(payload);

      const newId = `PRJ-${projectData.state?.substring(0, 2).toUpperCase() || 'IND'}-${String(projects.length + 1).padStart(3, '0')}`;
      
      const createdProject: Project = {
        id: newId,
        name: projectData.name || `New Parcel - ${projectData.district}`,
        project_type: projectData.project_type || 'Highways',
        state: projectData.state || 'Maharashtra',
        district: projectData.district || 'Pune',
        land_area_acres: projectData.land_area_acres || 100,
        affected_families: projectData.affected_families || 50,
        budget_crores: projectData.budget_crores || 350,
        target_completion_date: projectData.target_completion_date || '2027-12-31',
        status: prediction.risk_category === 'CRITICAL' ? 'CRITICAL_HALT' : prediction.risk_category === 'HIGH' ? 'DELAYED' : 'IN_PROGRESS',
        coordinates: projectData.coordinates || { lat: 18.5204, lng: 73.8567 },
        operational_status: projectData.operational_status,
        prediction: prediction,
        milestones: [
          { id: 'm1', name: 'Section 11 Notification', targetDate: '2025-02-01', status: 'COMPLETED', completionPercentage: 100 },
          { id: 'm2', name: 'Social Impact Assessment', targetDate: '2025-07-15', status: 'IN_PROGRESS', completionPercentage: 60 }
        ],
        alerts: prediction.risk_category === 'HIGH' || prediction.risk_category === 'CRITICAL' ? [
          {
            id: `ALT-${Date.now()}`,
            projectId: newId,
            projectName: projectData.name || 'New Project',
            title: `High Delay Propensity (${prediction.risk_score}/100)`,
            message: `Predicted ${prediction.estimated_delay_days} days delay due to ${prediction.delay_factors[0]?.description || 'operational bottlenecks'}.`,
            severity: prediction.risk_category === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
            category: 'LEGAL',
            createdAt: new Date().toISOString(),
            isResolved: false
          }
        ] : [],
        recommendations: prediction.corrective_recommendations.map((recText, idx) => ({
          id: `REC-${Date.now()}-${idx}`,
          projectId: newId,
          projectName: projectData.name || 'New Project',
          category: 'ML Mitigation',
          action: recText,
          impactDelayReductionDays: 30,
          priority: 'HIGH',
          status: 'PROPOSED'
        }))
      };

      setProjects((prev) => [createdProject, ...prev]);
      return createdProject;
    } finally {
      setIsLoading(false);
    }
  };

  const repredictProject = async (id: string, updatedStatus: OperationalStatus): Promise<Project> => {
    setIsLoading(true);
    try {
      const target = getProjectById(id);
      if (!target) throw new Error('Project not found');

      const payload: PredictionRequest = {
        project_type: target.project_type,
        state: target.state,
        district: target.district,
        land_area_acres: target.land_area_acres,
        affected_families: target.affected_families,
        ownership_complexity: updatedStatus.ownership_complexity,
        documentation_completeness: updatedStatus.documentation_completeness,
        legal_dispute: updatedStatus.legal_dispute,
        compensation_status: updatedStatus.compensation_status,
        approval_status: updatedStatus.approval_status,
        rehabilitation_status: updatedStatus.rehabilitation_status,
        possession_status: updatedStatus.possession_status,
        stakeholder_responsiveness: updatedStatus.stakeholder_responsiveness,
        administrative_processing_days: updatedStatus.administrative_processing_days,
        historical_delay_rate: updatedStatus.historical_delay_rate
      };

      const newPrediction = await predictDelay(payload);

      const updatedProject: Project = {
        ...target,
        operational_status: updatedStatus,
        prediction: newPrediction,
        status: newPrediction.risk_category === 'CRITICAL' ? 'CRITICAL_HALT' : newPrediction.risk_category === 'HIGH' ? 'DELAYED' : 'IN_PROGRESS'
      };

      setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));
      return updatedProject;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProjectStatus = (id: string, status: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const resolveAlert = (alertId: string) => {
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        alerts: p.alerts.map((a) => (a.id === alertId ? { ...a, isResolved: true } : a))
      }))
    );
  };

  const updateRecommendationStatus = (recId: string, newStatus: 'PROPOSED' | 'IN_IMPLEMENTATION' | 'RESOLVED') => {
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        recommendations: p.recommendations.map((r) => (r.id === recId ? { ...r, status: newStatus } : r))
      }))
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('ALL');
    setSelectedDistrict('ALL');
    setSelectedCategory('ALL');
    setSelectedProjectType('ALL');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        filteredProjects,
        searchQuery,
        setSearchQuery,
        selectedState,
        setSelectedState,
        selectedDistrict,
        setSelectedDistrict,
        selectedCategory,
        setSelectedCategory,
        selectedProjectType,
        setSelectedProjectType,
        isLoading,
        systemHealth,
        getProjectById,
        addNewProject,
        updateProjectStatus,
        repredictProject,
        resolveAlert,
        updateRecommendationStatus,
        resetFilters
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
