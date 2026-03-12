import { Prisma, PrismaClient,  } from '../generated/prisma';
import prisma from '../lib/db';

interface CreateStudentProfile {
  parentId: string;
  studentId: string;
  dbClient?: Prisma.TransactionClient | PrismaClient;
}
const studentProfileService = {
  createStudentProfile: async ({ dbClient, parentId, studentId }: CreateStudentProfile) => {
    const db = dbClient ?? prisma;
    const studentProfile = db.studentProfile.create({
      data: {
        parent_user_id: parentId,
        student_user_id: studentId,
      },
    });
    return studentProfile;
  },
  // fetch relevant details of all students that are linked to parentid
  findStudents: async ({ parentId }: { parentId: string }) => {
    const students = await prisma.studentProfile.findMany({
      where: {
        parent_user_id: parentId,
      },
      include: {
        student: {
          select: {
            user_id: true,
            username: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
    return students.map(s=>s.student);
  },
  
};
export default studentProfileService;
