import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { Project } from '../models/project.model.js';
import { Parcel } from '../models/parcel.model.js';
import { Alert } from '../models/alert.model.js';
import { Recommendation } from '../models/recommendation.model.js';

const DEMO_PASSWORD_HASH = bcrypt.hashSync('Password@123', 10);

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_01',
    email: 'admin@terratech.gov.in',
    password_hash: DEMO_PASSWORD_HASH,
    full_name: 'Rajesh Sharma',
    role: 'ADMIN',
    department: 'Ministry of Infrastructure & Land Resources',
    created_at: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: 'usr_officer_01',
    email: 'officer.patil@terratech.gov.in',
    password_hash: DEMO_PASSWORD_HASH,
    full_name: 'Sunita Patil',
    role: 'OFFICER',
    department: 'Revenue & Land Acquisition Directorate - Maharashtra',
    created_at: new Date('2024-02-01T10:00:00Z')
  },
  {
    id: 'usr_officer_02',
    email: 'officer.verma@terratech.gov.in',
    password_hash: DEMO_PASSWORD_HASH,
    full_name: 'Amit Verma',
    role: 'OFFICER',
    department: 'Special Land Acquisition Cell - Uttar Pradesh',
    created_at: new Date('2024-02-10T10:00:00Z')
  },
  {
    id: 'usr_policy_01',
    email: 'policy.iyer@terratech.gov.in',
    password_hash: DEMO_PASSWORD_HASH,
    full_name: 'Dr. Radhika Iyer',
    role: 'POLICYMAKER',
    department: 'NITI Aayog Infrastructure Division',
    created_at: new Date('2024-02-15T10:00:00Z')
  },
  {
    id: 'usr_viewer_01',
    email: 'viewer.analyst@terratech.gov.in',
    password_hash: DEMO_PASSWORD_HASH,
    full_name: 'Karan Mehta',
    role: 'VIEWER',
    department: 'Public Project Monitoring Cell',
    created_at: new Date('2024-03-01T10:00:00Z')
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj_dmic_01',
    name: 'Delhi-Mumbai Industrial Corridor - Dighi Port Industrial Area',
    code: 'DMIC-MH-2024-001',
    project_type: 'Industrial Corridor',
    state: 'Maharashtra',
    district: 'Raigad',
    total_land_area_ha: 1250.50,
    budget_cr: 4500.00,
    affected_families: 840,
    status: 'IN_PROGRESS',
    risk_score: 78.50,
    risk_category: 'CRITICAL',
    delay_probability: 0.85,
    estimated_delay_days: 180,
    primary_delay_factors: [
      'Legal Disputes in High Court',
      'Disputed Compensation Formula',
      'Coastal Regulatory Zone Clearances'
    ],
    created_at: new Date('2024-01-10T09:00:00Z'),
    updated_at: new Date('2024-09-01T11:00:00Z')
  },
  {
    id: 'prj_wdfc_02',
    name: 'Western Dedicated Freight Corridor - Sector 4 Link',
    code: 'WDFC-UP-2024-002',
    project_type: 'Railway Freight',
    state: 'Uttar Pradesh',
    district: 'Gautam Buddha Nagar',
    total_land_area_ha: 420.25,
    budget_cr: 2800.00,
    affected_families: 310,
    status: 'IN_PROGRESS',
    risk_score: 64.20,
    risk_category: 'HIGH',
    delay_probability: 0.71,
    estimated_delay_days: 120,
    primary_delay_factors: [
      'Multi-party Joint Family Title Disputes',
      'Pending Gram Sabha Consent'
    ],
    created_at: new Date('2024-02-12T09:00:00Z'),
    updated_at: new Date('2024-08-20T14:30:00Z')
  },
  {
    id: 'prj_bsrp_03',
    name: 'Bengaluru Suburban Rail Project - Corridor 2',
    code: 'BSRP-KA-2024-003',
    project_type: 'Urban Transit',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    total_land_area_ha: 180.75,
    budget_cr: 3450.00,
    affected_families: 620,
    status: 'IN_PROGRESS',
    risk_score: 52.40,
    risk_category: 'MEDIUM',
    delay_probability: 0.54,
    estimated_delay_days: 65,
    primary_delay_factors: [
      'Urban Encroachment Clearance',
      'Defense Land Transfer Formalities'
    ],
    created_at: new Date('2024-03-05T10:00:00Z'),
    updated_at: new Date('2024-08-15T16:00:00Z')
  },
  {
    id: 'prj_cme_04',
    name: 'Chennai Port - Maduravoyal Elevated Corridor Package II',
    code: 'CME-TN-2024-004',
    project_type: 'Expressway',
    state: 'Tamil Nadu',
    district: 'Chennai',
    total_land_area_ha: 95.40,
    budget_cr: 5800.00,
    affected_families: 410,
    status: 'IN_PROGRESS',
    risk_score: 38.00,
    risk_category: 'LOW',
    delay_probability: 0.35,
    estimated_delay_days: 30,
    primary_delay_factors: [
      'Utility Relocation (Water and High Tension Cables)'
    ],
    created_at: new Date('2024-03-20T10:00:00Z'),
    updated_at: new Date('2024-08-01T12:00:00Z')
  },
  {
    id: 'prj_pol_05',
    name: 'Polavaram Right Main Canal Expansion Section III',
    code: 'POL-AP-2024-005',
    project_type: 'Irrigation & Canal',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    total_land_area_ha: 890.00,
    budget_cr: 1950.00,
    affected_families: 950,
    status: 'IN_PROGRESS',
    risk_score: 82.10,
    risk_category: 'CRITICAL',
    delay_probability: 0.88,
    estimated_delay_days: 210,
    primary_delay_factors: [
      'Rehabilitation & Resettlement Colony Handover Delay',
      'Tribal Land Rights Act Verification'
    ],
    created_at: new Date('2024-04-01T09:00:00Z'),
    updated_at: new Date('2024-09-02T10:00:00Z')
  },
  {
    id: 'prj_gsp_06',
    name: 'Dholera Special Investment Region - Solar Park Grid Substation',
    code: 'DSIR-GJ-2024-006',
    project_type: 'Renewable Energy',
    state: 'Gujarat',
    district: 'Ahmedabad',
    total_land_area_ha: 640.00,
    budget_cr: 1600.00,
    affected_families: 120,
    status: 'COMPLETED',
    risk_score: 21.50,
    risk_category: 'LOW',
    delay_probability: 0.15,
    estimated_delay_days: 10,
    primary_delay_factors: [
      'Minor Mutation Rectifications'
    ],
    created_at: new Date('2023-11-01T09:00:00Z'),
    updated_at: new Date('2024-07-20T15:00:00Z')
  }
];

export const INITIAL_PARCELS: Parcel[] = [
  {
    id: 'pcl_raigad_001',
    project_id: 'prj_dmic_01',
    parcel_number: 'DMIC-MH-RG-0142',
    survey_number: 'Sy. No. 142/3A',
    owner_name: 'Ganesh Tukaram Patil & 6 Co-sharers',
    land_type: 'Agricultural / Multi-crop',
    area_sqm: 18500.00,
    state: 'Maharashtra',
    district: 'Raigad',
    ownership_complexity: 'HIGH_COMPLEXITY_CO_SHARERS',
    documentation_status: 'PENDING_MUTATION',
    legal_disputes: 'CIVIL_COURT_INJUNCTION',
    compensation_status: 'ESCROW_DEPOSITED',
    approval_status: 'PENDING_CRZ',
    rehabilitation_status: 'R_R_PENDING',
    possession_status: 'PROTEST_NOT_HANDED_OVER',
    stakeholder_responsiveness: 'LOW',
    risk_category: 'CRITICAL',
    risk_score: 89.50,
    delay_probability: 0.92,
    estimated_delay_days: 195,
    coordinates_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [73.015, 18.295],
          [73.022, 18.295],
          [73.021, 18.302],
          [73.014, 18.301],
          [73.015, 18.295]
        ]
      ]
    },
    created_at: new Date('2024-01-15T11:00:00Z')
  },
  {
    id: 'pcl_raigad_002',
    project_id: 'prj_dmic_01',
    parcel_number: 'DMIC-MH-RG-0143',
    survey_number: 'Sy. No. 143/1',
    owner_name: 'Rameshwar Cooperative Orchards',
    land_type: 'Commercial Agro-forestry',
    area_sqm: 34200.00,
    state: 'Maharashtra',
    district: 'Raigad',
    ownership_complexity: 'MODERATE',
    documentation_status: 'VERIFIED',
    legal_disputes: 'ARBITRATION_PENDING',
    compensation_status: 'PARTIALLY_DISBURSED',
    approval_status: 'APPROVED',
    rehabilitation_status: 'COMPLETED',
    possession_status: 'PARTIAL_POSSESSION',
    stakeholder_responsiveness: 'MEDIUM',
    risk_category: 'HIGH',
    risk_score: 68.00,
    delay_probability: 0.72,
    estimated_delay_days: 110,
    coordinates_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [73.023, 18.296],
          [73.030, 18.297],
          [73.029, 18.304],
          [73.022, 18.303],
          [73.023, 18.296]
        ]
      ]
    },
    created_at: new Date('2024-01-16T12:00:00Z')
  },
  {
    id: 'pcl_gbn_001',
    project_id: 'prj_wdfc_02',
    parcel_number: 'WDFC-UP-GBN-089',
    survey_number: 'Khata No. 89 / Khasra 442',
    owner_name: 'Devendra Singh & Heirs of Late Harpal',
    land_type: 'Agricultural',
    area_sqm: 22400.00,
    state: 'Uttar Pradesh',
    district: 'Gautam Buddha Nagar',
    ownership_complexity: 'MODERATE',
    documentation_status: 'DOCUMENTATION_COMPLETE',
    legal_disputes: 'SECTION_64_OBJECTION',
    compensation_status: 'ENHANCED_COMPENSATION_DEMANDED',
    approval_status: 'APPROVED',
    rehabilitation_status: 'IN_PROGRESS',
    possession_status: 'NOTICE_ISSUED',
    stakeholder_responsiveness: 'MEDIUM',
    risk_category: 'HIGH',
    risk_score: 66.50,
    delay_probability: 0.69,
    estimated_delay_days: 105,
    coordinates_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [77.512, 28.435],
          [77.520, 28.436],
          [77.519, 28.442],
          [77.510, 28.441],
          [77.512, 28.435]
        ]
      ]
    },
    created_at: new Date('2024-02-18T10:00:00Z')
  },
  {
    id: 'pcl_blr_001',
    project_id: 'prj_bsrp_03',
    parcel_number: 'BSRP-KA-BLR-0210',
    survey_number: 'Sy. No. 210/2, Yeshwanthpur Industrial Suburb',
    owner_name: 'Kaveri Logistics Warehouse Ltd',
    land_type: 'Industrial / Commercial',
    area_sqm: 8200.00,
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    ownership_complexity: 'HIGH_VALUE_COMMERCIAL',
    documentation_status: 'COMPLETE',
    legal_disputes: 'NONE',
    compensation_status: 'UNDER_NEGOTIATION',
    approval_status: 'APPROVED',
    rehabilitation_status: 'NOT_APPLICABLE',
    possession_status: 'MUTUAL_SETTLEMENT_STAGE',
    stakeholder_responsiveness: 'HIGH',
    risk_category: 'MEDIUM',
    risk_score: 51.20,
    delay_probability: 0.52,
    estimated_delay_days: 55,
    coordinates_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [77.551, 13.021],
          [77.556, 13.022],
          [77.555, 13.026],
          [77.550, 13.025],
          [77.551, 13.021]
        ]
      ]
    },
    created_at: new Date('2024-03-10T14:00:00Z')
  },
  {
    id: 'pcl_pol_001',
    project_id: 'prj_pol_05',
    parcel_number: 'POL-AP-WG-0512',
    survey_number: 'R.S. No. 512, Polavaram Mandal',
    owner_name: 'Venkata Ramaiah Agency Tribal Cooperative',
    land_type: 'Tribal Community Forest & Homestead',
    area_sqm: 41000.00,
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    ownership_complexity: 'PESTA_SCHEDULED_AREA',
    documentation_status: 'FRA_TITLE_VERIFICATION_ONGOING',
    legal_disputes: 'TRIBUNAL_APPEAL',
    compensation_status: 'R_R_AWARD_CONTESTED',
    approval_status: 'CONDITIONAL_CLEARANCE',
    rehabilitation_status: 'NEW_SETTLEMENT_UNDER_CONSTRUCTION',
    possession_status: 'RESISTANCE_REPORTED',
    stakeholder_responsiveness: 'LOW',
    risk_category: 'CRITICAL',
    risk_score: 91.00,
    delay_probability: 0.94,
    estimated_delay_days: 220,
    coordinates_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [81.621, 17.251],
          [81.632, 17.253],
          [81.630, 17.262],
          [81.619, 17.260],
          [81.621, 17.251]
        ]
      ]
    },
    created_at: new Date('2024-04-10T09:30:00Z')
  },
  {
    id: 'pcl_dhol_001',
    project_id: 'prj_gsp_06',
    parcel_number: 'DSIR-GJ-AHM-0088',
    survey_number: 'Block No. 88, Valinda Village',
    owner_name: 'Gujarat State Land Development Corporation',
    land_type: 'Government Wasteland',
    area_sqm: 95000.00,
    state: 'Gujarat',
    district: 'Ahmedabad',
    ownership_complexity: 'CLEAN_GOVERNMENT_TITLE',
    documentation_status: 'ALL_DOCS_CLEAR',
    legal_disputes: 'NONE',
    compensation_status: 'INTER_DEPARTMENTAL_TRANSFER_DONE',
    approval_status: 'ALL_CLEARANCES_OBTAINED',
    rehabilitation_status: 'NOT_APPLICABLE',
    possession_status: 'POSSESSION_TAKEN',
    stakeholder_responsiveness: 'EXCELLENT',
    risk_category: 'LOW',
    risk_score: 18.00,
    delay_probability: 0.12,
    estimated_delay_days: 5,
    coordinates_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [72.215, 22.241],
          [72.228, 22.242],
          [72.227, 22.253],
          [72.214, 22.251],
          [72.215, 22.241]
        ]
      ]
    },
    created_at: new Date('2023-11-20T10:00:00Z')
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt_001',
    project_id: 'prj_dmic_01',
    project_name: 'Delhi-Mumbai Industrial Corridor - Dighi Port Industrial Area',
    title: 'High Delay Probability Alert: Raigad Section C',
    message: 'Parcel Sy. No. 142/3A has triggered a 92% delay probability alert due to prolonged High Court stay and multiple co-sharers objection.',
    severity: 'CRITICAL',
    category: 'LEGAL_RISK',
    is_read: false,
    triggered_at: new Date('2024-09-20T10:00:00Z'),
    created_at: new Date('2024-09-20T10:00:00Z')
  },
  {
    id: 'alt_002',
    project_id: 'prj_pol_05',
    project_name: 'Polavaram Right Main Canal Expansion Section III',
    title: 'R&R Rehabilitation Colony Deadline Exceeded',
    message: 'Target completion for Resettlement Colony Sector-B passed 45 days ago. Possession handover blocked by community representatives.',
    severity: 'CRITICAL',
    category: 'REHABILITATION_DELAY',
    is_read: false,
    triggered_at: new Date('2024-09-18T14:30:00Z'),
    created_at: new Date('2024-09-18T14:30:00Z')
  },
  {
    id: 'alt_003',
    project_id: 'prj_wdfc_02',
    project_name: 'Western Dedicated Freight Corridor - Sector 4 Link',
    title: 'Compensation Formula Protest in Gautam Buddha Nagar',
    message: 'Gram Sabha meeting scheduled regarding Section 64 reference for circle rate revision.',
    severity: 'WARNING',
    category: 'COMPENSATION_DISPUTE',
    is_read: false,
    triggered_at: new Date('2024-09-15T09:15:00Z'),
    created_at: new Date('2024-09-15T09:15:00Z')
  },
  {
    id: 'alt_004',
    project_id: 'prj_bsrp_03',
    project_name: 'Bengaluru Suburban Rail Project - Corridor 2',
    title: 'Commercial Warehouse Valuation Clearance Pending',
    message: 'Private negotiation committee report overdue for Parcel BSRP-KA-BLR-0210 by 14 days.',
    severity: 'WARNING',
    category: 'ADMINISTRATIVE_PROCESSING',
    is_read: true,
    triggered_at: new Date('2024-09-10T16:00:00Z'),
    created_at: new Date('2024-09-10T16:00:00Z')
  },
  {
    id: 'alt_005',
    project_id: 'prj_cme_04',
    project_name: 'Chennai Port - Maduravoyal Elevated Corridor Package II',
    title: 'Environmental Clearance Review Scheduled',
    message: 'State Environmental Impact Assessment Authority (SEIAA) quarterly review scheduled for next week.',
    severity: 'INFO',
    category: 'REGULATORY_APPROVAL',
    is_read: true,
    triggered_at: new Date('2024-09-05T11:00:00Z'),
    created_at: new Date('2024-09-05T11:00:00Z')
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec_001',
    project_id: 'prj_dmic_01',
    delay_factor: 'Legal Disputes in High Court',
    recommended_action: 'Constitute an expedited Land Acquisition, Rehabilitation and Resettlement Authority (LARRA) Fast-Track Lok Adalat Bench to settle co-sharer inheritance claims outside formal court hearings.',
    priority: 'HIGH',
    estimated_time_saving_days: 90,
    status: 'IN_REVIEW',
    created_at: new Date('2024-09-01T10:00:00Z')
  },
  {
    id: 'rec_002',
    project_id: 'prj_dmic_01',
    delay_factor: 'Disputed Compensation Formula',
    recommended_action: 'Utilize direct consent award mechanism under Section 23A with 25% ex-gratia incentive for immediate possession hand-over.',
    priority: 'HIGH',
    estimated_time_saving_days: 60,
    status: 'APPROVED',
    created_at: new Date('2024-09-02T10:00:00Z')
  },
  {
    id: 'rec_003',
    project_id: 'prj_pol_05',
    delay_factor: 'Rehabilitation & Resettlement Colony Handover Delay',
    recommended_action: 'Deploy Special Nodal Officer from Tribal Welfare Directorate for on-site verification and interim rental allowance disbursement during colony finishing.',
    priority: 'HIGH',
    estimated_time_saving_days: 75,
    status: 'ACTION_IN_PROGRESS',
    created_at: new Date('2024-09-03T10:00:00Z')
  },
  {
    id: 'rec_004',
    project_id: 'prj_wdfc_02',
    delay_factor: 'Multi-party Joint Family Title Disputes',
    recommended_action: 'Initiate formal Family Settlement Deed registry camp with Sub-Divisional Magistrate (SDM) presence to disburse individual shares into Aadhaar-linked escrow.',
    priority: 'MEDIUM',
    estimated_time_saving_days: 45,
    status: 'PENDING',
    created_at: new Date('2024-09-04T10:00:00Z')
  },
  {
    id: 'rec_005',
    project_id: 'prj_bsrp_03',
    delay_factor: 'Defense Land Transfer Formalities',
    recommended_action: 'Execute inter-departmental working permission protocol with Ministry of Defence against bank guarantee while formal cabinet note is processed.',
    priority: 'MEDIUM',
    estimated_time_saving_days: 40,
    status: 'ACTION_IN_PROGRESS',
    created_at: new Date('2024-09-05T10:00:00Z')
  }
];

class MockDataStore {
  public users: User[] = [...INITIAL_USERS];
  public projects: Project[] = [...INITIAL_PROJECTS];
  public parcels: Parcel[] = [...INITIAL_PARCELS];
  public alerts: Alert[] = [...INITIAL_ALERTS];
  public recommendations: Recommendation[] = [...INITIAL_RECOMMENDATIONS];

  reset() {
    this.users = [...INITIAL_USERS];
    this.projects = [...INITIAL_PROJECTS];
    this.parcels = [...INITIAL_PARCELS];
    this.alerts = [...INITIAL_ALERTS];
    this.recommendations = [...INITIAL_RECOMMENDATIONS];
  }
}

export const mockStore = new MockDataStore();
