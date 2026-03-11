import { User } from '../generated/prisma';
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
    role: string;
    first_name: string;
    last_name: string;
  }) => {
    const userRow = await prisma.user.create({
      data: { username, hashed_password, role, first_name, last_name },
    });
    return userRow;
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
