import { Prisma, PrismaClient, User, UserRole } from '../generated/prisma';
import prisma from '../lib/db';
interface CreateUserService {
  user: {
    username: string;
    hashed_password: string;
    role: UserRole;
    first_name: string;
    last_name: string;
  };
  dbClient?: Prisma.TransactionClient | PrismaClient;
}
const userService = {
  createUser: async ({ dbClient, user }: CreateUserService) => {
    const db = dbClient ?? prisma;
    const userRow = await db.user.create({
      data: user,
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
