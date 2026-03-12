import { Router, Request } from 'express';
import { AuthResponse } from './interface/auth.interface';
import bookingsController from '../controllers/bookings.controller';

const bookingsRouter = Router();

// Only parents are allowed
bookingsRouter.post('/', async (req: Request, res: AuthResponse) => {
  return bookingsController.createBooking(req, res);
});

// parents and students can view their bookings.
bookingsRouter.get('/', async (req: Request, res: AuthResponse) => {
  return bookingsController.fetchBookings(req, res);
});

export default bookingsRouter;
