/**
 * Incoming JSON for POST /events (matches {@link IEvent} fields used on create).
 */
export interface CreateEventBodyDto {
  title?: string;
  description?: string;
  date?: Date | string;
  location?: string;
}
