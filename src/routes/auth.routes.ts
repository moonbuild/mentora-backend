import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../auth.middleware';
import authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', async (req: Request, res: Response) => {
  return authController.signup(req, res);
});

authRouter.post('/login', async (req: Request, res: Response) => {
  return authController.login(req, res);
});
authRouter.post('/refresh', async (req: AuthRequest, res: Response) => {
  return authController.refresh(req, res);
});
authRouter.get('/protected', authenticate, async (req: AuthRequest, res: Response) => {
  return authController.protectedRouteTest(req, res);
});

export default authRouter;
