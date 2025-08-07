// index.js
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './db.js';

import authRoutes from './routes/authRoutes.js';
import diaryRoutes from './routes/diaryRoutes.js';
import imageRoutes from './routes/imageRoutes.js'; // Supabase Image
import depressionRoutes from './routes/depressionRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import aiWebhookRoutes from './routes/aiWebhookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiSyncRoutes from './routes/aiSyncRoutes.js';

import aiRoutes from './routes/aiRoutes.js';

dotenv.config(); // .env Load

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // 모든 출처 허용
// app.use(cors({ // 추후에 서버 연결
//   origin: 'https://your-frontend-domain.com'
// }));

app.use(bodyParser.json());

connectDB().then(() => {
  // Connect Routers
  app.use('/auth', authRoutes);
  app.use('/diary', diaryRoutes);
  app.use('/image', imageRoutes);
  app.use('/depression', depressionRoutes);
  app.use('/question', questionRoutes);
  app.use('/webhook', aiWebhookRoutes);
  app.use('/user', userRoutes);
  app.use('/ai-sync', aiSyncRoutes);
  app.use('/api', aiRoutes);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});