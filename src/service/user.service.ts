import { Prisma, PrismaClient, User, } from '../generated/prisma';
import prisma from '../lib/db';
import { CreateUserDTO } from '../routes/interface/users.interface';

interface CreateUserService {
  user: CreateUserDTO;
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
  findUserByUserId: async ({ userId }: { userId: string }) => {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select:{
        // we need to show only necessary details
        first_name:true,
        last_name:true,
        username:true,
        role:true
      }
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
