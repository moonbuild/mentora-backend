import { Request, Response } from 'express';
import prisma from '../lib/db';

const tasksController = {
  createTask: async (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!description) return res.status(400).json({ error: 'Description is required' });
    console.log(title, description);
    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
        },
      });
      return res.status(201).json(newTask);
    } catch {
      return res.status(500).json({ error: 'Failed to create task' });
    }
  },

  getTasks: async (_: Request, res: Response) => {
    try {
      const tasks = await prisma.task.findMany({ orderBy: { created_at: 'desc' } });
      console.log(tasks);
      return res.status(200).json(tasks);
    } catch {
      return res.status(500).json({ error: 'Failed to create task' });
    }
  },
};

export default tasksController;
