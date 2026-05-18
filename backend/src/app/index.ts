import express from 'express';
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRoutes } from '../modules/auth';
import { eventsRoutes } from '../modules/events';

/**
 * Build the Express app (middleware, routes, Swagger). No listen — use in `server.ts` and tests.
 */
export function createApp(swaggerDocument: object): Express {
  const app = express();

  if (process.env.TRUST_PROXY !== 'false') {
    app.set('trust proxy', 1);
  }

  const sendOpenApi = (req: express.Request, res: express.Response): void => {
    try {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.json(swaggerDocument);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'OpenAPI failed';
      res.status(500).json({ message });
    }
  };

  app.get(
    [
      '/openapi.json',
      '/openapi.json/',
      '/api/openapi',
      '/api/openapi.json',
      '/api-spec.json',
      '/v1/openapi.json',
    ],
    sendOpenApi
  );

  app.get('/__health', (_req, res) => {
    res.json({ ok: true, service: 'event-api', swaggerUi: true, openApi: 'swagger-jsdoc' });
  });

  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const pathOnly = (req.originalUrl || '').split('?')[0];
    if (pathOnly === '/api-docs') return res.redirect(301, '/api-docs/');
    if (pathOnly === '/swagger') return res.redirect(301, '/swagger/');
    next();
  });

  const swaggerUiOptions = {
    customSiteTitle: 'Event API - Swagger',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      docExpansion: 'full' as const,
      defaultModelsExpandDepth: 2,
      tryItOutEnabled: true,
      filter: false,
      showExtensions: true,
      showCommonExtensions: true,
    },
  };

  const swaggerStaticOpts = { redirect: false };

  app.use(
    '/api-docs',
    ...swaggerUi.serveWithOptions(swaggerStaticOpts),
    swaggerUi.setup(swaggerDocument, swaggerUiOptions)
  );
  app.use(
    '/swagger',
    ...swaggerUi.serveWithOptions(swaggerStaticOpts),
    swaggerUi.setup(swaggerDocument, swaggerUiOptions)
  );

  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventsRoutes);

  return app;
}
