import { getOpenApiServers } from './openapi-settings';

/**
 * Base OpenAPI document merged with `@openapi` blocks in route files.
 * Add/reuse schemas here. HTTP paths and operations are defined in `routes/*` with `@openapi` (swagger-jsdoc).
 * Server URLs come from `openapi-settings.ts` (PORT / SWAGGER_BASE_URL).
 */
export function getOpenApiTemplate(): Record<string, unknown> {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Event API',
      version: '1.0.1',
      description:
        'REST API for event records in MongoDB. Accounts: JWT + refresh, sessions, audit logs (`GET /api/auth/audit-logs`), Google SSO, password reset, account lockout; Events CRUD.',
    },
    servers: getOpenApiServers(),
    tags: [
      { name: 'Events', description: 'Event list, create, delete' },
      {
        name: 'Accounts',
        description:
          'Registration, JWT sign-in, sessions, audit logs, refresh/logout/logout-all, password lockout, password reset, Google SSO',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Event: {
          type: 'object',
          required: ['title', 'date'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            __v: { type: 'number' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 500 },
            message: { type: 'string' },
          },
        },
        AccountLockedResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 423 },
            message: { type: 'string' },
            lockUntil: {
              type: 'string',
              format: 'date-time',
              description: 'Password login is blocked until this instant (UTC)',
            },
          },
        },
        CreateEventInput: {
          type: 'object',
          required: ['title', 'date'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string', default: '' },
            date: { type: 'string', format: 'date-time' },
            location: { type: 'string', default: '' },
          },
        },
        DeleteMessage: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Event deleted' },
          },
        },
        EventsListResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string' },
            events: {
              type: 'array',
              items: { $ref: '#/components/schemas/Event' },
            },
          },
        },
        EventCreatedResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 201 },
            message: { type: 'string' },
            event: { $ref: '#/components/schemas/Event' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            deviceName: {
              type: 'string',
              description: 'Optional device label (or use header X-Device-Name)',
            },
          },
        },
        AuthTokensResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string' },
            accessToken: { type: 'string', description: 'Bearer JWT for API calls' },
            refreshToken: {
              type: 'string',
              description: 'Opaque token for POST /api/auth/refresh only; store securely',
            },
            token: {
              type: 'string',
              description: 'Same as accessToken (legacy field)',
            },
            expiresIn: {
              type: 'integer',
              description: 'Access token lifetime in seconds',
              example: 900,
            },
          },
        },
        RefreshTokenInput: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
            deviceName: {
              type: 'string',
              description: 'Optional — updates label on rotated session',
            },
          },
        },
        SessionEntry: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Refresh session id' },
            deviceName: { type: 'string' },
            ipAddress: { type: 'string', description: 'Observed client IP at login / last refresh' },
            createdAt: { type: 'string', format: 'date-time' },
            lastUsedAt: { type: 'string', format: 'date-time' },
          },
        },
        SessionsListResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string' },
            sessions: {
              type: 'array',
              items: { $ref: '#/components/schemas/SessionEntry' },
            },
          },
        },
        AuditLogEntry: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            action: {
              type: 'string',
              enum: ['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGIN_LOCKED', 'LOGIN_SSO_SUCCESS'],
              description: 'LOGIN_FAILURE includes wrong password, unknown email, Google-only account',
            },
            ipAddress: { type: 'string' },
            userAgent: { type: 'string' },
            metadata: {
              type: 'object',
              additionalProperties: true,
              description:
                'e.g. reason unknown_user | bad_password | google_only, accountLocked, lockUntil',
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        AuditLogsResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string' },
            logs: {
              type: 'array',
              items: { $ref: '#/components/schemas/AuditLogEntry' },
            },
          },
        },
        LogoutInput: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
        RegisterUserResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 201 },
            message: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
        SimpleMessageResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string' },
          },
        },
        ForgotPasswordInput: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
        ResetPasswordInput: {
          type: 'object',
          required: ['token', 'password'],
          properties: {
            token: {
              type: 'string',
              description: 'Plain token from the reset link query string',
            },
            password: { type: 'string', format: 'password', minLength: 8 },
          },
        },
      },
    },
  };
}
