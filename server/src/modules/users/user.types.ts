import type { Types } from 'mongoose';

export interface RegisterBodyDto {
  name?: string;
  email?: string;
  password?: string;
}

export interface RegisteredUserDto {
  _id: Types.ObjectId;
  name: string;
  email: string;
  createdAt?: Date;
}
