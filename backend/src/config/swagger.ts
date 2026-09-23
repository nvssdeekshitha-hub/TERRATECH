export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'TerraTech Predictive Analytics & Decision Support API',
    version: '1.0.0',
    description:
      'API documentation for TerraTech: An AI-powered platform for detecting and preventing land acquisition delays for infrastructure projects.',
    contact: {
      name: 'TerraTech Support',
      email: 'support@terratech.gov.in'
    }
  },
  servers: [
    {
      url: '/api',
      description: 'Current Environment API Base'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT Bearer token obtained from POST /api/auth/login'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          full_name: { type: 'string' },
          role: { type: 'string', enum: ['ADMIN', 'OFFICER', 'POLICYMAKER', 'VIEWER'] },
          department: { type: 'string' }
        }
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          code: { type: 'string' },
          project_type: { type: 'string' },
          state: { type: 'string' },
          district: { type: 'string' },
          total_land_area_ha: { type: 'number' },
          budget_cr: { type: 'number' },
          affected_families: { type: 'integer' },
          status: { type: 'string', enum: ['PLANNED', 'IN_PROGRESS', 'DELAYED', 'COMPLETED', 'HALTED'] },
          risk_score: { type: 'number' },
          risk_category: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
          delay_probability: { type: 'number' },
          estimated_delay_days: { type: 'integer' },
          primary_delay_factors: { type: 'array', items: { type: 'string' } }
        }
      },
      Parcel: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          project_id: { type: 'string' },
          parcel_number: { type: 'string' },
          survey_number: { type: 'string' },
          owner_name: { type: 'string' },
          land_type: { type: 'string' },
          area_sqm: { type: 'number' },
          state: { type: 'string' },
          district: { type: 'string' },
          ownership_complexity: { type: 'string' },
          documentation_status: { type: 'string' },
          legal_disputes: { type: 'string' },
          compensation_status: { type: 'string' },
          approval_status: { type: 'string' },
          rehabilitation_status: { type: 'string' },
          possession_status: { type: 'string' },
          stakeholder_responsiveness: { type: 'string' },
          risk_category: { type: 'string' },
          risk_score: { type: 'number' },
          delay_probability: { type: 'number' },
          estimated_delay_days: { type: 'integer' },
          coordinates_geojson: { type: 'object' }
        }
      },
      PredictionInput: {
        type: 'object',
        required: [
          'project_type',
          'state',
          'district',
          'land_area_sqm',
          'ownership_complexity',
          'documentation_status',
          'legal_disputes',
          'compensation_status',
          'approval_status',
          'rehabilitation_status',
          'possession_status',
          'stakeholder_responsiveness'
        ],
        properties: {
          project_id: { type: 'string' },
          parcel_id: { type: 'string' },
          project_type: { type: 'string', example: 'Expressway' },
          state: { type: 'string', example: 'Maharashtra' },
          district: { type: 'string', example: 'Raigad' },
          land_area_sqm: { type: 'number', example: 18500 },
          affected_families: { type: 'integer', example: 7 },
          ownership_complexity: { type: 'string', example: 'HIGH_COMPLEXITY_CO_SHARERS' },
          documentation_status: { type: 'string', example: 'PENDING_MUTATION' },
          legal_disputes: { type: 'string', example: 'CIVIL_COURT_INJUNCTION' },
          compensation_status: { type: 'string', example: 'ESCROW_DEPOSITED' },
          approval_status: { type: 'string', example: 'PENDING_CRZ' },
          rehabilitation_status: { type: 'string', example: 'R_R_PENDING' },
          possession_status: { type: 'string', example: 'PROTEST_NOT_HANDED_OVER' },
          stakeholder_responsiveness: { type: 'string', example: 'LOW' }
        }
      },
      PredictionResponse: {
        type: 'object',
        properties: {
          delay_probability: { type: 'number', example: 0.85 },
          risk_score: { type: 'number', example: 78.5 },
          risk_category: { type: 'string', example: 'CRITICAL' },
          estimated_delay_days: { type: 'integer', example: 180 },
          explainable_ai: { type: 'object' },
          recommendations: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Service health status',
        responses: {
          200: { description: 'Service operational status' }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'full_name'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  full_name: { type: 'string' },
                  role: { type: 'string', enum: ['ADMIN', 'OFFICER', 'POLICYMAKER', 'VIEWER'] },
                  department: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error' },
          409: { description: 'User already exists' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Log in and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/projects': {
      get: {
        tags: ['Projects'],
        summary: 'List projects with filtering and pagination',
        parameters: [
          { name: 'state', in: 'query', schema: { type: 'string' } },
          { name: 'district', in: 'query', schema: { type: 'string' } },
          { name: 'riskCategory', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }
        ],
        responses: {
          200: { description: 'Array of projects with pagination metadata' }
        }
      },
      post: {
        tags: ['Projects'],
        summary: 'Create project (ADMIN or OFFICER only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        },
        responses: {
          201: { description: 'Project created' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' }
        }
      }
    },
    '/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Get project details with parcel metrics',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project details and summary metrics' },
          404: { description: 'Project not found' }
        }
      },
      put: {
        tags: ['Projects'],
        summary: 'Update project (ADMIN or OFFICER only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } }
        },
        responses: {
          200: { description: 'Project updated' },
          404: { description: 'Project not found' }
        }
      }
    },
    '/projects/{id}/recommendations': {
      get: {
        tags: ['Recommendations'],
        summary: 'Get project delay mitigation recommendations',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'List of corrective recommendations' }
        }
      }
    },
    '/parcels': {
      get: {
        tags: ['Parcels'],
        summary: 'List parcels with state, district, riskCategory, project, status filters',
        parameters: [
          { name: 'state', in: 'query', schema: { type: 'string' } },
          { name: 'district', in: 'query', schema: { type: 'string' } },
          { name: 'riskCategory', in: 'query', schema: { type: 'string' } },
          { name: 'project', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'List of parcels' }
        }
      }
    },
    '/parcels/{id}': {
      get: {
        tags: ['Parcels'],
        summary: 'Get parcel record by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Parcel detail record' },
          404: { description: 'Parcel not found' }
        }
      }
    },
    '/predictions': {
      post: {
        tags: ['Predictions'],
        summary: 'Send features to Python FastAPI ML service to predict delay and risk score',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PredictionInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Predicted delay metrics and explainable AI insights',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PredictionResponse' } } }
          }
        }
      }
    },
    '/analytics/overview': {
      get: {
        tags: ['Analytics'],
        summary: 'Get totalProjects, highRiskProjects, criticalProjects, averageDelayProbability, averageEstimatedDelay',
        responses: {
          200: { description: 'Overview high-level KPIs' }
        }
      }
    },
    '/analytics/states': {
      get: {
        tags: ['Analytics'],
        summary: 'Get state-wise aggregation and delay metrics',
        responses: {
          200: { description: 'State-wise metrics' }
        }
      }
    },
    '/analytics/districts': {
      get: {
        tags: ['Analytics'],
        summary: 'Get district-wise aggregation and risk ratings',
        responses: {
          200: { description: 'District-wise metrics' }
        }
      }
    },
    '/analytics/delay-trends': {
      get: {
        tags: ['Analytics'],
        summary: 'Get historical quarterly delay trends',
        responses: {
          200: { description: 'Delay trends' }
        }
      }
    },
    '/analytics/factors': {
      get: {
        tags: ['Analytics'],
        summary: 'Get breakdown of main delay factors',
        responses: {
          200: { description: 'Delay factors breakdown' }
        }
      }
    },
    '/gis/parcels': {
      get: {
        tags: ['GIS'],
        summary: 'Get GeoJSON FeatureCollection for Leaflet.js / OpenStreetMap',
        parameters: [
          { name: 'projectId', in: 'query', schema: { type: 'string' } },
          { name: 'state', in: 'query', schema: { type: 'string' } },
          { name: 'district', in: 'query', schema: { type: 'string' } },
          { name: 'riskCategory', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'GeoJSON FeatureCollection' }
        }
      }
    },
    '/alerts': {
      get: {
        tags: ['Alerts'],
        summary: 'List early-warning alerts',
        parameters: [
          { name: 'projectId', in: 'query', schema: { type: 'string' } },
          { name: 'severity', in: 'query', schema: { type: 'string' } },
          { name: 'isRead', in: 'query', schema: { type: 'boolean' } }
        ],
        responses: {
          200: { description: 'List of alerts' }
        }
      },
      post: {
        tags: ['Alerts'],
        summary: 'Create custom threshold alert (ADMIN or OFFICER)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['project_id', 'title', 'message', 'severity', 'category'],
                properties: {
                  project_id: { type: 'string' },
                  title: { type: 'string' },
                  message: { type: 'string' },
                  severity: { type: 'string', enum: ['INFO', 'WARNING', 'CRITICAL'] },
                  category: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Alert created' }
        }
      }
    },
    '/alerts/{id}/read': {
      put: {
        tags: ['Alerts'],
        summary: 'Mark alert as read',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Alert marked as read' }
        }
      }
    }
  }
};
