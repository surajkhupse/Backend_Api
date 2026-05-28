import type { NextFunction, Request, Response } from 'express';
import type { CreateEventBodyDto } from './event.types';
import Event from './event.model';
import { reply } from '../../utils/response';
export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const event = await Event.create(req.body as CreateEventBodyDto);
    return reply(res, 201, 'Event created', { event });
  } catch (error) {
    return next(error);
  }
};

export const getEvents = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const events = await Event.find();
    return reply(res, 200, 'Events retrieved', { events });
  } catch (error) {
    return next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    return reply(res, 200, 'Event deleted');
  } catch (error) {
    return next(error);
  }
};
