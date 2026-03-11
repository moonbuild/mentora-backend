import { Response, Router } from 'express';
import { AuthRequest } from '../auth.middleware';
import studentsController from '../controllers/students.controller';

const studentsRouter = Router();

studentsRouter.post('/', async (req: AuthRequest, res: Response) => {
  return studentsController.createStudent(req, res);
});

// this will fetch all students that the parent (user) is responsible for
studentsRouter.get('/', async (req: AuthRequest, res: Response) => {
  return studentsController.getMyStudents(req, res);
});

export default studentsRouter;
