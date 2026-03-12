import prisma from '../lib/db';

interface CreateBookingService {
  lessonId: string;
  studentProfileId: string;
}

const bookingsService = {
  // to create a new booking row, studentProfileId must be provided/created by the controller.
  createBooking: async ({ lessonId, studentProfileId }: CreateBookingService) => {
    const booking = await prisma.booking.create({
      data: {
        lesson_id: lessonId,
        student_profile_id: studentProfileId,
      },
    });
    return booking;
  },
  fetchBookingsByProfileId: async ({ studentProfileId }: { studentProfileId: string }) => {
    const lessons = await prisma.booking.findMany({
      where: {
        student_profile_id: studentProfileId,
      },
    });
    return lessons;
  },
  fetchBookingsByStudentProfile: async ({
    studentProfile,
  }: {
    studentProfile: { parent_user_id: string } | { student_user_id: string };
  }) => {
    const bookings = await prisma.booking.findMany({
      where: {
        student_profile: studentProfile,
      },
      include: {
        lesson: {
          select: {
            title: true,
            description: true,
            mentor: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        student_profile: {
          select: {
            student_user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });
    return bookings;
  },
};

export default bookingsService;
