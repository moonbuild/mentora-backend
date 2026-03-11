import { UserRole } from '../../generated/prisma';

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
