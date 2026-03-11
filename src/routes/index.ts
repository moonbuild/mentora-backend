import { Router } from 'express';
import generalRouter from './general.routes';
import tasksRouter from './tasks.routes';
import authRouter from './auth.routes';

const router = Router();

router.use('/', generalRouter);
router.use('/health', generalRouter);
router.use('/auth', authRouter);

router.use('/tasks', tasksRouter); // this is just dummy table to test connections and other queries for now

export default router;
