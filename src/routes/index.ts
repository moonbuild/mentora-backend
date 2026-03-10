import { Router } from 'express';
import generalRouter from './general.routes';
import tasksRouter from './tasks.routes';

const router = Router();

router.use('/', generalRouter);
router.use('/health', generalRouter);
// this is just dummy table to test connections and other queries for now
router.use('/tasks', tasksRouter);

export default router;
