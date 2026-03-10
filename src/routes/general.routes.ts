import { Response, Router } from 'express';

const generalRouter = Router();
generalRouter.get('/', (_, res: Response) => {
  res.json({ message: 'The School API is online' });
});
generalRouter.get('/health', (_, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString,
  });
});

export default generalRouter;
