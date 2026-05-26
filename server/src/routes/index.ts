import type { Express } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import eventsRoutes from '../modules/events/events.routes';

export function registerRoutes(app: Express): void {
  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventsRoutes);
}
