// models/Diary.js

import mongoose from 'mongoose';

const DiarySchema = new mongoose.Schema({
  userId: { type: String, required: true },     // 외래키처럼 사용자 식별
  text: { type: String, required: true },       // 일기 본문 (암호화된 상태)
  keywords: { type: [String], default: [] },    // AI 후처리 키워드
  imagePath: { type: String, default: 'https://fbffiyvnxkshgxepiimj.supabase.co/storage/v1/object/public/emoseum-images//emoseum_icon.png' }, //이미지 URL
  reflection_prompt: { type: String, default: '' },  // AI 생성 이미지 프롬프트
  title: { type: String, default: null },
  tags: { type: Array, default: [] },
  createdAt: { type: String, required: true },  // ISO 날짜 문자열
  updatedAt: { type: String, default: null }    // 후처리 업데이트용
});

const Diary = mongoose.model('Diary', DiarySchema, 'Emoseum');
export default Diary;
