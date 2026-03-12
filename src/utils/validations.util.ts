import { UserRole } from '../generated/prisma';

export const isValidRole = (value: string): value is UserRole => {
  return value == 'mentor' || value == 'parent' || value == 'student';
};
