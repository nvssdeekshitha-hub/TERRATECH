-- ==============================================================================
-- TerraTech Seed Data
-- Realistic Infrastructure Land Acquisition Datasets
-- Password for all demo users is: "Password@123"
-- Hashed with bcrypt (salt rounds 10): $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5J6kE94X0V1tCqR7rS38C3XhOti
-- ==============================================================================

-- Seed Users
INSERT INTO users (id, email, password_hash, full_name, role, department)
VALUES
('usr_admin_01', 'admin@terratech.gov.in', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5J6kE94X0V1tCqR7rS38C3XhOti', 'Rajesh Sharma', 'ADMIN', 'Ministry of Infrastructure & Land Resources'),
('usr_officer_01', 'officer.patil@terratech.gov.in', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5J6kE94X0V1tCqR7rS38C3XhOti', 'Sunita Patil', 'OFFICER', 'Revenue & Land Acquisition Directorate - Maharashtra'),
('usr_officer_02', 'officer.verma@terratech.gov.in', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5J6kE94X0V1tCqR7rS38C3XhOti', 'Amit Verma', 'OFFICER', 'Special Land Acquisition Cell - Uttar Pradesh'),
('usr_policy_01', 'policy.iyer@terratech.gov.in', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5J6kE94X0V1tCqR7rS38C3XhOti', 'Dr. Radhika Iyer', 'POLICYMAKER', 'NITI Aayog Infrastructure Division'),
('usr_viewer_01', 'viewer.analyst@terratech.gov.in', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5J6kE94X0V1tCqR7rS38C3XhOti', 'Karan Mehta', 'VIEWER', 'Public Project Monitoring Cell')
ON CONFLICT (id) DO NOTHING;

-- Seed Projects
INSERT INTO projects (id, name, code, project_type, state, district, total_land_area_ha, budget_cr, affected_families, status, risk_score, risk_category, delay_probability, estimated_delay_days, primary_delay_factors)
VALUES
(
    'prj_dmic_01',
    'Delhi-Mumbai Industrial Corridor - Dighi Port Industrial Area',
    'DMIC-MH-2024-001',
    'Industrial Corridor',
    'Maharashtra',
    'Raigad',
    1250.50,
    4500.00,
    840,
    'IN_PROGRESS',
    78.50,
    'CRITICAL',
    0.85,
    180,
    '["Legal Disputes in High Court", "Disputed Compensation Formula", "Coastal Regulatory Zone Clearances"]'::jsonb
),
(
    'prj_wdfc_02',
    'Western Dedicated Freight Corridor - Sector 4 Link',
    'WDFC-UP-2024-002',
    'Railway Freight',
    'Uttar Pradesh',
    'Gautam Buddha Nagar',
    420.25,
    2800.00,
    310,
    'IN_PROGRESS',
    64.20,
    'HIGH',
    0.71,
    120,
    '["Multi-party Joint Family Title Disputes", "Pending Gram Sabha Consent"]'::jsonb
),
(
    'prj_bsrp_03',
    'Bengaluru Suburban Rail Project - Corridor 2 (Baiyappanahalli to Chikkabanavara)',
    'BSRP-KA-2024-003',
    'Urban Transit',
    'Karnataka',
    'Bengaluru Urban',
    180.75,
    3450.00,
    620,
    'IN_PROGRESS',
    52.40,
    'MEDIUM',
    0.54,
    65,
    '["Urban Encroachment Clearance", "Defense Land Transfer Formalities"]'::jsonb
),
(
    'prj_cme_04',
    'Chennai Port - Maduravoyal Elevated Corridor Package II',
    'CME-TN-2024-004',
    'Expressway',
    'Tamil Nadu',
    'Chennai',
    95.40,
    5800.00,
    410,
    'IN_PROGRESS',
    38.00,
    'LOW',
    0.35,
    30,
    '["Utility Relocation (Water and High Tension Cables)"]'::jsonb
),
(
    'prj_pol_05',
    'Polavaram Right Main Canal Expansion Section III',
    'POL-AP-2024-005',
    'Irrigation & Canal',
    'Andhra Pradesh',
    'West Godavari',
    890.00,
    1950.00,
    950,
    'IN_PROGRESS',
    82.10,
    'CRITICAL',
    0.88,
    210,
    '["Rehabilitation & Resettlement Colony Handover Delay", "Tribal Land Rights Act Verification"]'::jsonb
),
(
    'prj_gsp_06',
    'Dholera Special Investment Region - Solar Park Grid Substation',
    'DSIR-GJ-2024-006',
    'Renewable Energy',
    'Gujarat',
    'Ahmedabad',
    640.00,
    1600.00,
    120,
    'COMPLETED',
    21.50,
    'LOW',
    0.15,
    10,
    '["Minor Mutation Rectifications"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed Parcels
INSERT INTO parcels (id, project_id, parcel_number, survey_number, owner_name, land_type, area_sqm, state, district, ownership_complexity, documentation_status, legal_disputes, compensation_status, approval_status, rehabilitation_status, possession_status, stakeholder_responsiveness, risk_category, risk_score, delay_probability, estimated_delay_days, coordinates_geojson)
VALUES
(
    'pcl_raigad_001',
    'prj_dmic_01',
    'DMIC-MH-RG-0142',
    'Sy. No. 142/3A',
    'Ganesh Tukaram Patil & 6 Co-sharers',
    'Agricultural / Multi-crop',
    18500.00,
    'Maharashtra',
    'Raigad',
    'HIGH_COMPLEXITY_CO_SHARERS',
    'PENDING_MUTATION',
    'CIVIL_COURT_INJUNCTION',
    'ESCROW_DEPOSITED',
    'PENDING_CRZ',
    'R_R_PENDING',
    'PROTEST_NOT_HANDED_OVER',
    'LOW',
    'CRITICAL',
    89.50,
    0.92,
    195,
    '{"type": "Polygon", "coordinates": [[[73.015, 18.295], [73.022, 18.295], [73.021, 18.302], [73.014, 18.301], [73.015, 18.295]]]}'::jsonb
),
(
    'pcl_raigad_002',
    'prj_dmic_01',
    'DMIC-MH-RG-0143',
    'Sy. No. 143/1',
    'Rameshwar Cooperative Orchards',
    'Commercial Agro-forestry',
    34200.00,
    'Maharashtra',
    'Raigad',
    'MODERATE',
    'VERIFIED',
    'ARBITRATION_PENDING',
    'PARTIALLY_DISBURSED',
    'APPROVED',
    'COMPLETED',
    'PARTIAL_POSSESSION',
    'MEDIUM',
    'HIGH',
    68.00,
    0.72,
    110,
    '{"type": "Polygon", "coordinates": [[[73.023, 18.296], [73.030, 18.297], [73.029, 18.304], [73.022, 18.303], [73.023, 18.296]]]}'::jsonb
),
(
    'pcl_gbn_001',
    'prj_wdfc_02',
    'WDFC-UP-GBN-089',
    'Khata No. 89 / Khasra 442',
    'Devendra Singh & Heirs of Late Harpal',
    'Agricultural',
    22400.00,
    'Uttar Pradesh',
    'Gautam Buddha Nagar',
    'MODERATE',
    'DOCUMENTATION_COMPLETE',
    'SECTION_64_OBJECTION',
    'ENHANCED_COMPENSATION_DEMANDED',
    'APPROVED',
    'IN_PROGRESS',
    'NOTICE_ISSUED',
    'MEDIUM',
    'HIGH',
    66.50,
    0.69,
    105,
    '{"type": "Polygon", "coordinates": [[[77.512, 28.435], [77.520, 28.436], [77.519, 28.442], [77.510, 28.441], [77.512, 28.435]]]}'::jsonb
),
(
    'pcl_blr_001',
    'prj_bsrp_03',
    'BSRP-KA-BLR-0210',
    'Sy. No. 210/2, Yeshwanthpur Industrial Suburb',
    'Kaveri Logistics Warehouse Ltd',
    'Industrial / Commercial',
    8200.00,
    'Karnataka',
    'Bengaluru Urban',
    'HIGH_VALUE_COMMERCIAL',
    'COMPLETE',
    'NONE',
    'UNDER_NEGOTIATION',
    'APPROVED',
    'NOT_APPLICABLE',
    'MUTUAL_SETTLEMENT_STAGE',
    'HIGH',
    'MEDIUM',
    51.20,
    0.52,
    55,
    '{"type": "Polygon", "coordinates": [[[77.551, 13.021], [77.556, 13.022], [77.555, 13.026], [77.550, 13.025], [77.551, 13.021]]]}'::jsonb
),
(
    'pcl_pol_001',
    'prj_pol_05',
    'POL-AP-WG-0512',
    'R.S. No. 512, Polavaram Mandal',
    'Venkata Ramaiah Agency Tribal Cooperative',
    'Tribal Community Forest & Homestead',
    41000.00,
    'Andhra Pradesh',
    'West Godavari',
    'PESTA_SCHEDULED_AREA',
    'FRA_TITLE_VERIFICATION_ONGOING',
    'TRIBUNAL_APPEAL',
    'R_R_AWARD_CONTESTED',
    'CONDITIONAL_CLEARANCE',
    'NEW_SETTLEMENT_UNDER_CONSTRUCTION',
    'RESISTANCE_REPORTED',
    'LOW',
    'CRITICAL',
    91.00,
    0.94,
    220,
    '{"type": "Polygon", "coordinates": [[[81.621, 17.251], [81.632, 17.253], [81.630, 17.262], [81.619, 17.260], [81.621, 17.251]]]}'::jsonb
),
(
    'pcl_dhol_001',
    'prj_gsp_06',
    'DSIR-GJ-AHM-0088',
    'Block No. 88, Valinda Village',
    'Gujarat State Land Development Corporation',
    'Government Wasteland',
    95000.00,
    'Gujarat',
    'Ahmedabad',
    'CLEAN_GOVERNMENT_TITLE',
    'ALL_DOCS_CLEAR',
    'NONE',
    'INTER_DEPARTMENTAL_TRANSFER_DONE',
    'ALL_CLEARANCES_OBTAINED',
    'NOT_APPLICABLE',
    'POSSESSION_TAKEN',
    'EXCELLENT',
    'LOW',
    18.00,
    0.12,
    5,
    '{"type": "Polygon", "coordinates": [[[72.215, 22.241], [72.228, 22.242], [72.227, 22.253], [72.214, 22.251], [72.215, 22.241]]]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed Alerts
INSERT INTO alerts (id, project_id, title, message, severity, category, is_read)
VALUES
(
    'alt_001',
    'prj_dmic_01',
    'High Delay Probability Alert: Raigad Section C',
    'Parcel Sy. No. 142/3A has triggered a 92% delay probability alert due to prolonged High Court stay and multiple co-sharers objection.',
    'CRITICAL',
    'LEGAL_RISK',
    false
),
(
    'alt_002',
    'prj_pol_05',
    'R&R Rehabilitation Colony Deadline Exceeded',
    'Target completion for Resettlement Colony Sector-B passed 45 days ago. Possession handover blocked by community representatives.',
    'CRITICAL',
    'REHABILITATION_DELAY',
    false
),
(
    'alt_003',
    'prj_wdfc_02',
    'Compensation Formula Protest in Gautam Buddha Nagar',
    'Gram Sabha meeting scheduled regarding Section 64 reference for circle rate revision.',
    'WARNING',
    'COMPENSATION_DISPUTE',
    false
),
(
    'alt_004',
    'prj_bsrp_03',
    'Commercial Warehouse Valuation Clearance Pending',
    'Private negotiation committee report overdue for Parcel BSRP-KA-BLR-0210 by 14 days.',
    'WARNING',
    'ADMINISTRATIVE_PROCESSING',
    true
),
(
    'alt_005',
    'prj_cme_04',
    'Environmental Clearance Review Scheduled',
    'State Environmental Impact Assessment Authority (SEIAA) quarterly review scheduled for next week.',
    'INFO',
    'REGULATORY_APPROVAL',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Seed Recommendations
INSERT INTO recommendations (id, project_id, delay_factor, recommended_action, priority, estimated_time_saving_days, status)
VALUES
(
    'rec_001',
    'prj_dmic_01',
    'Legal Disputes in High Court',
    'Constitute an expedited Land Acquisition, Rehabilitation and Resettlement Authority (LARRA) Fast-Track Lok Adalat Bench to settle co-sharer inheritance claims outside formal court hearings.',
    'HIGH',
    90,
    'IN_REVIEW'
),
(
    'rec_002',
    'prj_dmic_01',
    'Disputed Compensation Formula',
    'Utilize direct consent award mechanism under Section 23A with 25% ex-gratia incentive for immediate possession hand-over.',
    'HIGH',
    60,
    'APPROVED'
),
(
    'rec_003',
    'prj_pol_05',
    'Rehabilitation & Resettlement Colony Handover Delay',
    'Deploy Special Nodal Officer from Tribal Welfare Directorate for on-site verification and interim rental allowance disbursement during colony finishing.',
    'HIGH',
    75,
    'ACTION_IN_PROGRESS'
),
(
    'rec_004',
    'prj_wdfc_02',
    'Multi-party Joint Family Title Disputes',
    'Initiate formal Family Settlement Deed registry camp with Sub-Divisional Magistrate (SDM) presence to disburse individual shares into Aadhaar-linked escrow.',
    'MEDIUM',
    45,
    'PENDING'
),
(
    'rec_005',
    'prj_bsrp_03',
    'Defense Land Transfer Formalities',
    'Execute inter-departmental working permission protocol with Ministry of Defence against bank guarantee while formal cabinet note is processed.',
    'MEDIUM',
    40,
    'ACTION_IN_PROGRESS'
)
ON CONFLICT (id) DO NOTHING;
