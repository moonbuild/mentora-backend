import { Router, Request, Response } from 'express';
import llmController from '../controllers/llm.controller';
import { summarizelimiter } from '../middleware/ratelimiter.middleware';

const llmRouter = Router();

llmRouter.post('/summarize', summarizelimiter, async (req: Request, res: Response) => {
  return llmController.summarizeText(req, res);
});

export default llmRouter;
