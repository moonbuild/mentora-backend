import { UserRole } from '../../generated/prisma';
import { Response } from 'express';

export interface JwtPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}
export interface AuthLocals {
  userId: string;
  role: UserRole;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AuthResponse = Response<any, AuthLocals>;

export interface SignupReq {
  username: string;
  password: string;
  role: UserRole;
  first_name: string;
  last_name: string;
}
export interface LoginReq {
  username: string;
  password: string;
}
