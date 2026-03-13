import { AuthResponse } from '../routes/interface/auth.interface';
import { LessonDTO } from '../routes/interface/lessons.interface';
import lessonsService from '../service/lesson.service';
import { Request } from 'express';

const lessonsController = {
  createLesson: async (req: Request, res: AuthResponse) => {
    const { userId: mentorId, role } = res.locals;
    // only mentors can create lessons
    if (role !== 'mentor')
      return res.status(403).json({ error: 'Only Mentors are allowed to create lessons' });

    // validate the title, description
    const { title, description } = req.body as LessonDTO;
    // validation
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!description) return res.status(400).json({ error: 'Description is required' });

    try {
      // create a new row in lesson table
      const lesson = await lessonsService.createLesson({ title, description, mentorId });
      return res.status(201).json(lesson);
    } catch (error) {
      console.error('Failed to create lesson ', error);
      return res.status(500).json({ error: 'Failed to create lesson' });
    }
  },
  fetchAllLessons: async (req: Request, res: AuthResponse) => {
    const { role } = res.locals;
    // only parents are authorized to fetch all lessons
    // this fetches all lessons regardless of mentor
    if (role !== 'parent')
      return res
        .status(403)
        .json({ error: 'Only Parents are allowed to view all lessons of all mentors' });
    try {
      const lessons = await lessonsService.fetchAllLessons();
      return res.status(200).json(lessons);
    } catch (error) {
      console.error('Failed to fetch lessons ', error);
      return res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  },
  fetchMentorLessons: async (req: Request, res: AuthResponse) => {
    const { userId: mentorId, role } = res.locals;
    // this is for mentors to access/view their lessons
    if (role !== 'mentor')
      return res.status(403).json({ error: 'Only Mentors are authorized to this endpoint' });
    try {
      const lessons = await lessonsService.fetchMentorLessons({ mentorId });
      return res.status(200).json(lessons);
    } catch (error) {
      console.error('Failed to fetch lessons ', error);
      return res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  },
};

export default lessonsController;
