import prisma from '../lib/db';
import { AuthResponse } from '../routes/interface/auth.interface';
import { Request } from 'express';
import { SessionDTO } from '../routes/interface/session.interface';

const sessionsController = {
  createSession: async (req: Request, res: AuthResponse) => {
    // using the lesson id create a new session
    const { role } = res.locals;
    const lessonId = req.params['lessonId'] as string;
    if (role !== 'mentor')
      return res.status(401).json({ error: 'Only Mentors are allowed to create sessions' });

    const { topic, date: dateRaw, summary } = req.body as SessionDTO;
    const date = new Date(dateRaw);
    if (!topic) return res.status(400).json({ error: 'Title is required' });
    if (!date) return res.status(400).json({ error: 'Date is required' });
    if (!summary) return res.status(400).json({ error: 'Summary is required' });

    try {
      const session = await prisma.session.create({
        data: {
          topic,
          date,
          summary,
          lesson_id: lessonId,
        },
      });
      return res.status(200).json(session);
    } catch (error) {
      console.error('Failed to create session ', error);
      return res.status(500).json({ error: 'Failed to create session' });
    }
  },

  fetchSessions: async (req: Request, res: AuthResponse) => {
    // any role can view the sessions
    // using the lesson id from params fetch related sessions
    const lessonId = req.params['lessonId'] as string;
    try {
      const sessions = await prisma.session.findMany({
        where: {
          lesson_id: lessonId,
        },
        select: {
          date: true,
          summary: true,
          topic: true,
          session_id: true,
        },
      });
      return res.status(200).json(sessions);
    } catch (error) {
      console.error('Failed to fetch sessions ', error);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  },
};

export default sessionsController;
