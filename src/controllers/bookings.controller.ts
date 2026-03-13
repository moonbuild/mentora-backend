import { AuthResponse } from '../routes/interface/auth.interface';
import { BookingDTO } from '../routes/interface/booking.interface';
import { Request } from 'express';
import studentProfileService from '../service/studentProfile.service';
import bookingsService from '../service/bookings.service';

const bookingsController = {
  createBooking: async (req: Request, res: AuthResponse) => {
    const { userId: parentId, role } = res.locals;
    // only parents are authorized to create booking
    if (role !== 'parent')
      return res.status(403).json({ error: 'Only Parents are allowed to create Bookings' });

    const { studentId, lessonId } = req.body as BookingDTO;

    // base validation
    if (!studentId) return res.status(400).json({ error: 'Student Id is missing' });
    if (!lessonId) return res.status(400).json({ error: 'Lesson Id is missing' });

    try {
      // find the studentProfileId that has the matching studentParent relation
      const studentProfile = await studentProfileService.findStudentProfileByIds({
        studentId,
        parentId,
      });
      if (!studentProfile)
        return res.status(403).json({ error: 'Student Parent Relation does not exist' });

      // check if student is already booked to lesson
      const existingBooking = await bookingsService.bookingAlreadyExists({ lessonId, studentProfileId: studentProfile.student_profile_id });

      // if already existing return conflict
      if (existingBooking)
        return res.status(409).json({ error: 'Student is already registered to the lesson' });

      // now that we have the studentProfileId we can assign a student to the class that parent wishes to assign
      const booking = await bookingsService.createBooking({
        lessonId: lessonId,
        studentProfileId: studentProfile.student_profile_id,
      });
      return res.status(201).json(booking);
    } catch (error) {
      console.error('Failed to create Booking ', error);
      return res.status(500).json({ error: 'Failed to create Booking' });
    }
  },
  fetchBookings: async (req: Request, res: AuthResponse) => {
    const { userId: userId, role } = res.locals;
    // only parents and students can view their bookings
    if (role === 'mentor')
      return res
        .status(403)
        .json({ error: 'Only Parents & Students are allowed to view their Booking history' });

    try {
      // dynamic filter
      const studentProfile =
        role === 'parent' ? { parent_user_id: userId } : { student_user_id: userId };

      const bookings = await bookingsService.fetchBookingsByStudentProfile({
        studentProfile: studentProfile,
      });
      return res.status(200).json(bookings);
    } catch (error) {
      console.error('Failed to fetch bookings ', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  },
};

export default bookingsController;
