import prisma from '../lib/db';

interface CreateLessonService {
  title: string;
  description: string;
  mentorId: string;
}

const lessonsService = {
  createLesson: async ({ title, description, mentorId }: CreateLessonService) => {
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        mentor_id: mentorId,
      },
    });
    return lesson;
  },
  fetchAllLessons: async () => {
    const lessons = await prisma.lesson.findMany();
    return lessons;
  },
  fetchMentorLessons: async ({ mentorId }: { mentorId: string }) => {
    const lessons = await prisma.lesson.findMany({
      where: {
        mentor_id: mentorId,
      },
    });
    return lessons;
  },
};

export default lessonsService;
