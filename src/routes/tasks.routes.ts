import { Request, Response, Router } from 'express';
import tasksController from '../controllers/tasks.controller';

const tasksRouter = Router();

tasksRouter.post('/', async (req: Request, res: Response) => {
  return tasksController.createTask(req, res);
});

tasksRouter.get('/', async (req: Request, res: Response) => {
  console.log('hii');
  return tasksController.getTasks(req, res);
});

export default tasksRouter;
