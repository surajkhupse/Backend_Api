import type { Express } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import eventsRoutes from '../modules/events/events.routes';
import tenantsRoutes from '../modules/tenants/tenant.routes';
import usersRoutes from '../modules/users/user.routes';

export function registerRoutes(app: Express): void {
  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventsRoutes);
  app.use('/api/tenants', tenantsRoutes);
  app.use('/api/users', usersRoutes);
}
