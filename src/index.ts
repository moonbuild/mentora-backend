import dotenv from 'dotenv';
import express from 'express';
import prisma from './lib/db';
import router from './routes';

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

app.use('/', router);

prisma
  .$connect()
  .then(() => console.log('Successfully connected to Sqlite'))
  .catch((err) => console.error('Failed to connect to db:', err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
