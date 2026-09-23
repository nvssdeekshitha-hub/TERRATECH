import { Project, Alert, Recommendation } from '../types/project';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "PRJ-MH-001",
    name: "Mumbai-Nagpur Samruddhi Corridor Phase III",
    project_type: "Highways",
    state: "Maharashtra",
    district: "Pune",
    land_area_acres: 245.5,
    affected_families: 142,
    budget_crores: 480.0,
    target_completion_date: "2027-06-30",
    status: "DELAYED",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    operational_status: {
      ownership_complexity: 0.78,
      documentation_completeness: 0.42,
      legal_dispute: 1,
      compensation_status: 0.50,
      approval_status: 0.45,
      rehabilitation_status: 0.35,
      possession_status: 0.25,
      stakeholder_responsiveness: 0.55,
      administrative_processing_days: 215,
      historical_delay_rate: 0.42
    },
    prediction: {
      delay_probability: 0.84,
      risk_score: 84,
      risk_category: "HIGH",
      estimated_delay_days: 115,
      delay_factors: [
        {
          feature: "legal_dispute",
          transformed_feature: "num__legal_dispute",
          impact_score: 0.22,
          current_value: "1",
          description: "Active high court writ petition on land valuation increases delay probability by +22%"
        },
        {
          feature: "documentation_completeness",
          transformed_feature: "num__documentation_completeness",
          impact_score: 0.18,
          current_value: "0.42",
          description: "Low documentation completeness (42%) creates title verification bottlenecks"
        },
        {
          feature: "ownership_complexity",
          transformed_feature: "num__ownership_complexity",
          impact_score: 0.15,
          current_value: "0.78",
          description: "High co-ownership succession disputes across 142 families"
        }
      ],
      corrective_recommendations: [
        "Deploy Lok Adalat out-of-court arbitration bench to resolve Pune district land valuation writs.",
        "Mobilize revenue officer taskforce for 100% digital title deed verification within 30 days.",
        "Initiate direct bank transfer escrow setup for immediate 25% advance compensation disbursement."
      ],
      model_version: "v1.0.0"
    },
    milestones: [
      { id: "m1", name: "Section 11 Notification", targetDate: "2025-01-15", status: "COMPLETED", completionPercentage: 100 },
      { id: "m2", name: "Social Impact Assessment (SIA)", targetDate: "2025-05-20", status: "COMPLETED", completionPercentage: 100 },
      { id: "m3", name: "Section 19 Declaration", targetDate: "2025-10-10", status: "IN_PROGRESS", completionPercentage: 65 },
      { id: "m4", name: "Compensation Award Disbursement", targetDate: "2026-03-30", status: "OVERDUE", completionPercentage: 30 },
      { id: "m5", name: "Physical Possession Handover", targetDate: "2026-09-15", status: "PENDING", completionPercentage: 10 }
    ],
    alerts: [
      {
        id: "ALT-MH-01",
        projectId: "PRJ-MH-001",
        projectName: "Mumbai-Nagpur Samruddhi Corridor Phase III",
        title: "Active Writ Petition Filed in Bombay HC",
        message: "Landowners filed a collective writ petition challenging Section 19 land valuation rates.",
        severity: "CRITICAL",
        category: "LEGAL",
        createdAt: "2026-09-10T10:30:00Z",
        isResolved: false
      },
      {
        id: "ALT-MH-02",
        projectId: "PRJ-MH-001",
        projectName: "Mumbai-Nagpur Samruddhi Corridor Phase III",
        title: "Compensation Disbursement Lagging Target",
        message: "Only 50% of escrow funds released due to unverified revenue records.",
        severity: "HIGH",
        category: "FINANCIAL",
        createdAt: "2026-09-18T14:15:00Z",
        isResolved: false
      }
    ],
    recommendations: [
      {
        id: "REC-MH-01",
        projectId: "PRJ-MH-001",
        projectName: "Mumbai-Nagpur Samruddhi Corridor Phase III",
        category: "Legal & Arbitration",
        action: "Deploy Lok Adalat out-of-court arbitration bench to resolve Pune land valuation writs.",
        impactDelayReductionDays: 45,
        priority: "URGENT",
        status: "PROPOSED"
      },
      {
        id: "REC-MH-02",
        projectId: "PRJ-MH-001",
        projectName: "Mumbai-Nagpur Samruddhi Corridor Phase III",
        category: "Documentation",
        action: "Mobilize revenue officer taskforce for 100% digital title deed verification.",
        impactDelayReductionDays: 30,
        priority: "HIGH",
        status: "IN_IMPLEMENTATION"
      }
    ]
  },
  {
    id: "PRJ-UP-002",
    name: "Purvanchal Industrial Smart Expressway",
    project_type: "Industrial Corridors",
    state: "Uttar Pradesh",
    district: "Lucknow",
    land_area_acres: 520.0,
    affected_families: 310,
    budget_crores: 1250.0,
    target_completion_date: "2028-03-31",
    status: "CRITICAL_HALT",
    coordinates: { lat: 26.8467, lng: 80.9462 },
    operational_status: {
      ownership_complexity: 0.90,
      documentation_completeness: 0.35,
      legal_dispute: 1,
      compensation_status: 0.30,
      approval_status: 0.30,
      rehabilitation_status: 0.20,
      possession_status: 0.15,
      stakeholder_responsiveness: 0.40,
      administrative_processing_days: 280,
      historical_delay_rate: 0.58
    },
    prediction: {
      delay_probability: 0.92,
      risk_score: 92,
      risk_category: "CRITICAL",
      estimated_delay_days: 185,
      delay_factors: [
        {
          feature: "ownership_complexity",
          transformed_feature: "num__ownership_complexity",
          impact_score: 0.28,
          current_value: "0.90",
          description: "Severe multi-heir title disputes across 310 agricultural families"
        },
        {
          feature: "rehabilitation_status",
          transformed_feature: "num__rehabilitation_status",
          impact_score: 0.24,
          current_value: "0.20",
          description: "Critical lag in R&R site allocation and housing grant disbursement"
        }
      ],
      corrective_recommendations: [
        "Escalate to State Single-Window Approval Committee for expedited forest & environmental clearance.",
        "Deploy dedicated District Collector R&R grievance camp in Lucknow to resolve land allocation.",
        "Implement expedited SLA timelines under State Right to Public Services Act."
      ],
      model_version: "v1.0.0"
    },
    milestones: [
      { id: "m1", name: "Section 11 Notification", targetDate: "2024-11-10", status: "COMPLETED", completionPercentage: 100 },
      { id: "m2", name: "Social Impact Assessment", targetDate: "2025-04-15", status: "COMPLETED", completionPercentage: 100 },
      { id: "m3", name: "Section 19 Declaration", targetDate: "2025-09-30", status: "OVERDUE", completionPercentage: 40 },
      { id: "m4", name: "R&R Site Allocation", targetDate: "2026-02-15", status: "OVERDUE", completionPercentage: 20 }
    ],
    alerts: [
      {
        id: "ALT-UP-01",
        projectId: "PRJ-UP-002",
        projectName: "Purvanchal Industrial Smart Expressway",
        title: "Community Protests & R&R Grievances",
        message: "Displaced families halted physical survey demanding revised R&R compensation packages.",
        severity: "CRITICAL",
        category: "R_AND_R",
        createdAt: "2026-09-05T08:00:00Z",
        isResolved: false
      }
    ],
    recommendations: [
      {
        id: "REC-UP-01",
        projectId: "PRJ-UP-002",
        projectName: "Purvanchal Industrial Smart Expressway",
        category: "Rehabilitation & Resettlement",
        action: "Deploy dedicated District Collector R&R grievance camp to disburse cash grants.",
        impactDelayReductionDays: 60,
        priority: "URGENT",
        status: "PROPOSED"
      }
    ]
  },
  {
    id: "PRJ-GJ-003",
    name: "Dholera Ultra Mega Solar Park Phase II",
    project_type: "Solar Parks",
    state: "Gujarat",
    district: "Ahmedabad",
    land_area_acres: 850.0,
    affected_families: 45,
    budget_crores: 920.0,
    target_completion_date: "2026-12-31",
    status: "IN_PROGRESS",
    coordinates: { lat: 22.2474, lng: 72.1867 },
    operational_status: {
      ownership_complexity: 0.25,
      documentation_completeness: 0.88,
      legal_dispute: 0,
      compensation_status: 0.85,
      approval_status: 0.90,
      rehabilitation_status: 0.80,
      possession_status: 0.75,
      stakeholder_responsiveness: 0.85,
      administrative_processing_days: 75,
      historical_delay_rate: 0.15
    },
    prediction: {
      delay_probability: 0.18,
      risk_score: 18,
      risk_category: "LOW",
      estimated_delay_days: 0,
      delay_factors: [],
      corrective_recommendations: [
        "Maintain current milestone execution schedule and monthly progress audits."
      ],
      model_version: "v1.0.0"
    },
    milestones: [
      { id: "m1", name: "Section 11 Notification", targetDate: "2024-06-01", status: "COMPLETED", completionPercentage: 100 },
      { id: "m2", name: "Section 19 Declaration", targetDate: "2024-11-15", status: "COMPLETED", completionPercentage: 100 },
      { id: "m3", name: "Compensation Disbursement", targetDate: "2025-05-30", status: "COMPLETED", completionPercentage: 100 },
      { id: "m4", name: "Physical Possession Handover", targetDate: "2026-03-31", status: "IN_PROGRESS", completionPercentage: 85 }
    ],
    alerts: [],
    recommendations: []
  },
  {
    id: "PRJ-OD-004",
    name: "Jharsuguda Industrial Mining Logistics Hub",
    project_type: "Mining",
    state: "Odisha",
    district: "Jharsuguda",
    land_area_acres: 380.0,
    affected_families: 210,
    budget_crores: 650.0,
    target_completion_date: "2027-09-30",
    status: "DELAYED",
    coordinates: { lat: 21.8574, lng: 84.0060 },
    operational_status: {
      ownership_complexity: 0.65,
      documentation_completeness: 0.55,
      legal_dispute: 1,
      compensation_status: 0.55,
      approval_status: 0.40,
      rehabilitation_status: 0.45,
      possession_status: 0.35,
      stakeholder_responsiveness: 0.60,
      administrative_processing_days: 190,
      historical_delay_rate: 0.48
    },
    prediction: {
      delay_probability: 0.74,
      risk_score: 74,
      risk_category: "HIGH",
      estimated_delay_days: 85,
      delay_factors: [
        {
          feature: "approval_status",
          transformed_feature: "num__approval_status",
          impact_score: 0.20,
          current_value: "0.40",
          description: "Pending Stage-II Forest Clearance from Ministry of Environment & Forests"
        },
        {
          feature: "legal_dispute",
          transformed_feature: "num__legal_dispute",
          impact_score: 0.16,
          current_value: "1",
          description: "Tribal land rights litigation under FRA 2006"
        }
      ],
      corrective_recommendations: [
        "Schedule Gram Sabha consultation under Forest Rights Act with district tribal welfare officer.",
        "Fast-track Stage-II forest clearance clearance with state nodal office."
      ],
      model_version: "v1.0.0"
    },
    milestones: [
      { id: "m1", name: "Section 11 Notification", targetDate: "2025-02-10", status: "COMPLETED", completionPercentage: 100 },
      { id: "m2", name: "Gram Sabha Consent", targetDate: "2025-08-15", status: "IN_PROGRESS", completionPercentage: 50 },
      { id: "m3", name: "Forest Clearance Stage II", targetDate: "2026-01-20", status: "OVERDUE", completionPercentage: 35 }
    ],
    alerts: [
      {
        id: "ALT-OD-01",
        projectId: "PRJ-OD-004",
        projectName: "Jharsuguda Industrial Mining Logistics Hub",
        title: "Stage-II Forest Clearance Pending Over 180 Days",
        message: "Inter-departmental clearance stalled at State Nodal Officer level.",
        severity: "HIGH",
        category: "APPROVAL",
        createdAt: "2026-09-12T11:00:00Z",
        isResolved: false
      }
    ],
    recommendations: [
      {
        id: "REC-OD-01",
        projectId: "PRJ-OD-004",
        projectName: "Jharsuguda Industrial Mining Logistics Hub",
        category: "Statutory Clearances",
        action: "Escalate Stage-II Forest Clearance to Chief Secretary review meeting.",
        impactDelayReductionDays: 35,
        priority: "HIGH",
        status: "PROPOSED"
      }
    ]
  },
  {
    id: "PRJ-TN-005",
    name: "Chennai-Kanchipuram Defense Industrial Park",
    project_type: "Industrial Corridors",
    state: "Tamil Nadu",
    district: "Kanchipuram",
    land_area_acres: 190.0,
    affected_families: 85,
    budget_crores: 410.0,
    target_completion_date: "2026-11-30",
    status: "IN_PROGRESS",
    coordinates: { lat: 12.8342, lng: 79.7036 },
    operational_status: {
      ownership_complexity: 0.40,
      documentation_completeness: 0.75,
      legal_dispute: 0,
      compensation_status: 0.70,
      approval_status: 0.75,
      rehabilitation_status: 0.65,
      possession_status: 0.60,
      stakeholder_responsiveness: 0.75,
      administrative_processing_days: 110,
      historical_delay_rate: 0.22
    },
    prediction: {
      delay_probability: 0.35,
      risk_score: 35,
      risk_category: "MEDIUM",
      estimated_delay_days: 25,
      delay_factors: [
        {
          feature: "administrative_processing_days",
          transformed_feature: "num__administrative_processing_days",
          impact_score: 0.10,
          current_value: "110",
          description: "Minor administrative backlog in title verification"
        }
      ],
      corrective_recommendations: [
        "Deploy additional revenue inspectors to finalize remaining 30% title verifications."
      ],
      model_version: "v1.0.0"
    },
    milestones: [
      { id: "m1", name: "Section 11 Notification", targetDate: "2024-09-01", status: "COMPLETED", completionPercentage: 100 },
      { id: "m2", name: "Section 19 Declaration", targetDate: "2025-03-15", status: "COMPLETED", completionPercentage: 100 },
      { id: "m3", name: "Compensation Disbursement", targetDate: "2025-11-30", status: "IN_PROGRESS", completionPercentage: 70 }
    ],
    alerts: [],
    recommendations: []
  },
  {
    id: "PRJ-KA-006",
    name: "Bengaluru Suburban Rail Corridor 2",
    project_type: "Railways",
    state: "Karnataka",
    district: "Bengaluru Urban",
    land_area_acres: 165.0,
    affected_families: 280,
    budget_crores: 1550.0,
    target_completion_date: "2027-12-31",
    status: "DELAYED",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    operational_status: {
      ownership_complexity: 0.85,
      documentation_completeness: 0.50,
      legal_dispute: 1,
      compensation_status: 0.45,
      approval_status: 0.50,
      rehabilitation_status: 0.40,
      possession_status: 0.30,
      stakeholder_responsiveness: 0.50,
      administrative_processing_days: 200,
      historical_delay_rate: 0.45
    },
    prediction: {
      delay_probability: 0.78,
      risk_score: 78,
      risk_category: "HIGH",
      estimated_delay_days: 105,
      delay_factors: [
        {
          feature: "ownership_complexity",
          transformed_feature: "num__ownership_complexity",
          impact_score: 0.25,
          current_value: "0.85",
          description: "High urban land fragmentation and commercial easement disputes"
        }
      ],
      corrective_recommendations: [
        "Establish urban land acquisition taskforce with Bruhat Bengaluru Mahanagara Palike (BBMP).",
        "Offer direct TDR (Transferable Development Rights) incentives to commercial property owners."
      ],
      model_version: "v1.0.0"
    },
    milestones: [
      { id: "m1", name: "Joint Alignment Survey", targetDate: "2025-01-30", status: "COMPLETED", completionPercentage: 100 },
      { id: "m2", name: "Section 11 Notification", targetDate: "2025-07-15", status: "COMPLETED", completionPercentage: 100 },
      { id: "m3", name: "Section 19 Declaration", targetDate: "2026-02-28", status: "OVERDUE", completionPercentage: 45 }
    ],
    alerts: [
      {
        id: "ALT-KA-01",
        projectId: "PRJ-KA-006",
        projectName: "Bengaluru Suburban Rail Corridor 2",
        title: "Urban Commercial Property Valuation Dispute",
        message: "Commercial association rejected rural valuation metrics for urban corridor.",
        severity: "HIGH",
        category: "FINANCIAL",
        createdAt: "2026-09-15T16:20:00Z",
        isResolved: false
      }
    ],
    recommendations: [
      {
        id: "REC-KA-01",
        projectId: "PRJ-KA-006",
        projectName: "Bengaluru Suburban Rail Corridor 2",
        category: "Valuation & Compensation",
        action: "Approve TDR compensation framework for commercial land parcels.",
        impactDelayReductionDays: 50,
        priority: "URGENT",
        status: "PROPOSED"
      }
    ]
  },
  {
    id: "PRJ-BR-007",
    name: "Ganga River Barrage & Canal Expansion",
    project_type: "Water Resources",
    state: "Bihar",
    district: "Patna",
    land_area_acres: 310.0,
    affected_families: 420,
    budget_crores: 780.0,
    target_completion_date: "2028-06-30",
    status: "CRITICAL_HALT",
    coordinates: { lat: 25.5941, lng: 85.1376 },
    operational_status: {
      ownership_complexity: 0.92,
      documentation_completeness: 0.30,
      legal_dispute: 1,
      compensation_status: 0.25,
      approval_status: 0.35,
      rehabilitation_status: 0.15,
      possession_status: 0.10,
      stakeholder_responsiveness: 0.35,
      administrative_processing_days: 290,
      historical_delay_rate: 0.62
    },
    prediction: {
      delay_probability: 0.95,
      risk_score: 95,
      risk_category: "CRITICAL",
      estimated_delay_days: 210,
      delay_factors: [
        {
          feature: "documentation_completeness",
          transformed_feature: "num__documentation_completeness",
          impact_score: 0.32,
          current_value: "0.30",
          description: "Severe lack of updated Khatiyan (revenue records) in Patna floodplain"
        }
      ],
      corrective_recommendations: [
        "Deploy drone aerial mapping and special revenue court for rapid Khatiyan updating.",
        "Set up district R&R camp to disburse immediate relief and resettlement packages."
      ],
      model_version: "v1.0.0"
    },
    milestones: [
      { id: "m1", name: "Section 11 Notification", targetDate: "2024-10-01", status: "COMPLETED", completionPercentage: 100 },
      { id: "m2", name: "Social Impact Assessment", targetDate: "2025-03-31", status: "OVERDUE", completionPercentage: 35 }
    ],
    alerts: [
      {
        id: "ALT-BR-01",
        projectId: "PRJ-BR-007",
        projectName: "Ganga River Barrage & Canal Expansion",
        title: "Khatiyan Revenue Records Missing",
        message: "Over 60% of land parcels lack updated ownership titles in district gazetteer.",
        severity: "CRITICAL",
        category: "LEGAL",
        createdAt: "2026-09-01T09:00:00Z",
        isResolved: false
      }
    ],
    recommendations: [
      {
        id: "REC-BR-01",
        projectId: "PRJ-BR-007",
        projectName: "Ganga River Barrage & Canal Expansion",
        category: "Revenue & Records",
        action: "Deploy drone aerial survey & special revenue court drive.",
        impactDelayReductionDays: 75,
        priority: "URGENT",
        status: "PROPOSED"
      }
    ]
  },
  {
    id: "PRJ-RJ-008",
    name: "Jaipur Solar Tech Corridor",
    project_type: "Solar Parks",
    state: "Rajasthan",
    district: "Jaipur",
    land_area_acres: 600.0,
    affected_families: 20,
    budget_crores: 550.0,
    target_completion_date: "2026-10-31",
    status: "IN_PROGRESS",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    operational_status: {
      ownership_complexity: 0.20,
      documentation_completeness: 0.92,
      legal_dispute: 0,
      compensation_status: 0.90,
      approval_status: 0.88,
      rehabilitation_status: 0.85,
      possession_status: 0.80,
      stakeholder_responsiveness: 0.90,
      administrative_processing_days: 60,
      historical_delay_rate: 0.12
    },
    prediction: {
      delay_probability: 0.12,
      risk_score: 12,
      risk_category: "LOW",
      estimated_delay_days: 0,
      delay_factors: [],
      corrective_recommendations: [
        "Project operating on schedule. Maintain monthly progress reporting."
      ],
      model_version: "v1.0.0"
    },
    milestones: [
      { id: "m1", name: "Section 11 Notification", targetDate: "2024-05-01", status: "COMPLETED", completionPercentage: 100 },
      { id: "m2", name: "Section 19 Declaration", targetDate: "2024-10-15", status: "COMPLETED", completionPercentage: 100 },
      { id: "m3", name: "Physical Possession Handover", targetDate: "2025-06-30", status: "COMPLETED", completionPercentage: 100 }
    ],
    alerts: [],
    recommendations: []
  }
];
