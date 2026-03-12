import { UserRole } from '../../generated/prisma';

export interface CreateUserDTO {
  username: string;
  hashed_password: string;
  role: UserRole;
  first_name: string;
  last_name: string;
}
