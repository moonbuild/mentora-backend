import { AuthResponse } from '../routes/interface/auth.interface';
import { Request } from 'express';
import { SessionDTO } from '../routes/interface/session.interface';
import sessionsService from '../service/sessions.service';

const sessionsController = {
  createSession: async (req: Request, res: AuthResponse) => {
    // using the lesson id create a new session
    const { role } = res.locals;
    const lessonId = req.params['lessonId'] as string;

    // only mentors are authorized to create lessons
    if (role !== 'mentor')
      return res.status(403).json({ error: 'Only Mentors are allowed to create sessions' });

    const { topic, date: dateRaw, summary } = req.body as SessionDTO;
    const date = new Date(dateRaw);

    if (!topic) return res.status(400).json({ error: 'Title is required' });
    if (!date) return res.status(400).json({ error: 'Date is required' });
    if (!summary) return res.status(400).json({ error: 'Summary is required' });

    try {
      const session = await sessionsService.createSession({topic, date, summary, lessonId});
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
      const sessions = await sessionsService.findSessionsByLessonId({lessonId});
      return res.status(200).json(sessions);
    } catch (error) {
      console.error('Failed to fetch sessions ', error);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  },
};

export default sessionsController;
