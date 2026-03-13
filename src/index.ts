import dotenv from 'dotenv';
import express from 'express';
import prisma from './lib/db';
import router from './routes';

dotenv.config();

const app = express();

const port = process.env['PORT'];
const databaseUrl = process.env['DATABASE_URL'];
const accessTokenSecret = process.env['ACCESS_TOKEN_SECRET'];
const refreshSecret = process.env['REFRESH_SECRET'];
const groqAPI = process.env['GROQ_API_KEY'];

if (!port) {
  console.error('CRITICAL ERROR: PORT env is missing');
  process.exit(1);
}

if (!databaseUrl) {
  console.error('CRITICAL ERROR: DATABASE_URL env is missing');
  process.exit(1);
}

if (!accessTokenSecret) {
  console.error('CRITICAL ERROR: ACCESS_TOKEN_SECRET env is missing');
  process.exit(1);
}

if (!refreshSecret) {
  console.error('CRITICAL ERROR: REFRESH_SECRET env is missing');
  process.exit(1);
}

if (!groqAPI) {
  console.error('CRITICAL ERROR: GROQ_API_KEY env is missing');
  process.exit(1);
}

app.use(express.json());

app.use('/', router);

prisma
  .$connect()
  .then(() => console.log('Successfully connected to Postgresql'))
  .catch((err) => console.error('Failed to connect to db:', err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
