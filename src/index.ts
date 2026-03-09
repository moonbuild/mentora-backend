import dotenv from 'dotenv';
import express, { Response } from 'express';

dotenv.config();

const app = express();
const port = process.env['PORT'];

if (!port) {
  console.error('CRITICAL ERROR: PORT env is missing');
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
