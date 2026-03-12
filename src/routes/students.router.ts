import { Request, Router } from 'express';
import studentsController from '../controllers/students.controller';
import { AuthResponse } from './interface/auth.interface';

const studentsRouter = Router();

studentsRouter.post('/', async (req: Request, res: AuthResponse) => {
  return studentsController.createStudent(req, res);
});

// this will fetch all students that the parent (user) is responsible for
studentsRouter.get('/', async (req: Request, res: AuthResponse) => {
  return studentsController.getMyStudents(req, res);
});

export default studentsRouter;
