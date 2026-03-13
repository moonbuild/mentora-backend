import prisma from '../lib/db';

interface CreateSessionService {
  topic: string;
  date: Date;
  summary: string;
  lessonId: string;
}

const sessionsService = {
  createSession: async ({ date, topic, summary, lessonId }: CreateSessionService) => {
    const session = await prisma.session.create({
      data: {
        topic,
        date,
        summary,
        lesson_id: lessonId,
      },
    });
    return session;
  },

  findSessionsByLessonId: async ({ lessonId }: { lessonId: string }) => {
    const sessions = await prisma.session.findMany({
      where: {
        lesson_id: lessonId,
      },
      select: {
        date: true,
        summary: true,
        topic: true,
        session_id: true,
      },
    });
    return sessions;
  },
};

export default sessionsService;
