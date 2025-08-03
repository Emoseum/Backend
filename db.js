// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

const uri = process.env.MONGO_URI; // .env에서 Mongo URI 가져오기

export default async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      // 연결 상태
      return;
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Emoseum'
    });

    console.log('MongoDB connected with Mongoose');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
