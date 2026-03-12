import { Router, Request } from 'express';
import { AuthResponse } from './interface/auth.interface';
import lessonsController from '../controllers/lessons.controller';
import sessionsController from '../controllers/sessions.controller';

const lessonsRouter = Router();


// user must be a mentor to create a lesson
lessonsRouter.post('/', async (req: Request, res: AuthResponse) => {
  return lessonsController.createLesson(req, res);
});

// fetch all lessons associated to a mentor
lessonsRouter.get('/', async (req: Request, res: AuthResponse) => {
  return lessonsController.fetchLessons(req, res);
});

// only mentor can create sessions
lessonsRouter.post('/:lessonId/sessions', async (req: Request, res: AuthResponse) => {
  return sessionsController.createSession(req, res);
});

// any role can view the sessions
lessonsRouter.get('/:lessonId/sessions', async (req: Request, res: AuthResponse) => {
  return sessionsController.fetchSessions(req, res);
});

export default lessonsRouter;
