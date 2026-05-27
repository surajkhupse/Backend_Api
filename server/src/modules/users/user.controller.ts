import { Request, Response } from 'express';
import { reply } from '../../utils/response';
import { listUsers } from './user.service';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export const list = async (_req: Request, res: Response): Promise<Response | void> => {
  try {
    const users = await listUsers();
    return reply(res, 200, 'Users listed', { users });
  } catch (error) {
    return reply(res, 500, errorMessage(error));
  }
};
