import { Router } from 'express';
import generalRouter from './general.routes';
import authRouter from './auth.routes';
import { authenticate } from '../auth.middleware';
import studentsRouter from './students.router';

const router = Router();

router.use('/', generalRouter);
router.use('/auth', authRouter);
router.use('/students', authenticate, studentsRouter);

export default router;
