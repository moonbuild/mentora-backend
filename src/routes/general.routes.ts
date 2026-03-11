import { Response, Router } from 'express';
import { authenticate, AuthRequest } from '../auth.middleware';
import userService from '../service/user.service';

const generalRouter = Router();

generalRouter.get('/', (_, res: Response) => {
  return res.json({ message: 'The School API is online' });
});

generalRouter.get('/health', (_, res: Response) => {
  return res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString,
  });
});

generalRouter.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(400).json({ error: 'user id is not present' });
  const user = await userService.findUserByUserId({ userId });

  return res.status(201).json(user);
});

export default generalRouter;
