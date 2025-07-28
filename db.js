// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

const uri = process.env.MONGO_URI; // .env에서 Mongo URI 가져오기

export default async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      // 이미 연결
      return;
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Emoseum' // 명시적으로 사용할 DB 지정
    });

    console.log('MongoDB connected with Mongoose');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // 에러로 프로세스 종료
  }
}
