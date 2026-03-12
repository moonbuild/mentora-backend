import { Router } from 'express';
import generalRouter from './general.routes';
import authRouter from './auth.routes';
import { authenticate } from '../auth.middleware';
import studentsRouter from './students.router';
import lessonsRouter from './lessons.router';
import bookingsRouter from './bookings.router';

const router = Router();

router.use('/', generalRouter);
router.use('/auth', authRouter);
router.use('/students', authenticate, studentsRouter);
router.use('/lessons', authenticate, lessonsRouter);
router.use('/bookings', authenticate, bookingsRouter);

export default router;
