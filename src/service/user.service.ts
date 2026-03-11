import { User, UserRole } from '../generated/prisma';
import prisma from '../lib/db';

const userService = {
  createUser: async ({
    username,
    hashed_password,
    role,
    first_name,
    last_name,
  }: {
    username: string;
    hashed_password: string;
    role: UserRole;
    first_name: string;
    last_name: string;
  }) => {
    const userRow = await prisma.user.create({
      data: { username, hashed_password, role, first_name, last_name },
    });
    return userRow;
  },
  findUserByUserId: async ({ userId }: { userId: string }): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
    return user;
  },
  findUserByUsername: async ({ username }: { username: string }): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  },
};
export default userService;
