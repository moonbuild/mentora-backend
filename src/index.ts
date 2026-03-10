import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import prisma from './lib/db';

dotenv.config();

const app = express();
const port = process.env['PORT'];
const databaseUrl = process.env['DATABASE_URL'];

if (!port) {
  console.error('CRITICAL ERROR: PORT env is missing');
  process.exit(1);
}
if (!databaseUrl) {
  console.error('CRITICAL ERROR: DATABASE_URL env is missing');
  process.exit(1);
}
app.use(express.json());

// apis
app.get('/', (_, res: Response) => {
  res.json({ message: 'The School API is online' });
});
app.get('/health', (_, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString,
  });
});

// this is just dummy table to test connections and other queries for now
app.post('/tasks', async (req: Request, res: Response) => {
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
    console.log(newTask);
    return res.status(201).json(newTask);
  } catch {
    return res.status(500).json({ error: 'Failed to create task' });
  }
});

app.get('/tasks', async (_: Request, res: Response) => {
  try {
    const newTask = await prisma.task.findMany({ orderBy: { created_at: 'desc' } });
    return res.status(201).json(newTask);
  } catch {
    return res.status(500).json({ error: 'Failed to create task' });
  }
});

prisma.$connect()
  .then(() => console.log("Successfully connected to Sqlite"))
  .catch((err) => console.error("Failed to connect to db:", err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
