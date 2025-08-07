// models/Diary.js

import mongoose from 'mongoose';

const DiarySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  
  // AI 처리 데이터 (GALLERY_ITEM_SCHEMA 기반)
  ai_item_id: { type: String, default: null },
  emotion_analysis: {
    keywords: { type: [String], default: [] },
    vad_scores: { type: [Number], default: [0, 0, 0] },
    primary_emotion: { type: String, default: 'neutral' },
    intensity: { type: Number, default: 0.5 },
    normalized_all: { type: Object, default: {} },
    emotion_categories: { type: Object, default: {} }
  },
  generated_image: {
    image_path: { type: String, default: 'https://fbffiyvnxkshgxepiimj.supabase.co/storage/v1/object/public/emoseum-images//emoseum_icon.png' },
    prompt_used: { type: String, default: '' },
    generation_metadata: {
      service_used: { type: String, default: 'local' },
      generation_time: { type: Number, default: 0 },
      model_version: { type: String, default: '' }
    }
  },
  artwork_title: {
    title: { type: String, default: 'Untitled' },
    reflection: { type: String, default: '' }
  },
  docent_message: {
    message: { type: String, default: '' },
    message_type: { type: String, default: 'encouragement' },
    personalization_data: { type: Object, default: {} }
  },
  journey_stage: { type: String, default: 'the_moment' },
  is_completed: { type: Boolean, default: false },
  
  // 기존 필드 (호환성)
  keywords: { type: [String], default: [] },
  imagePath: { type: String, default: 'https://fbffiyvnxkshgxepiimj.supabase.co/storage/v1/object/public/emoseum-images//emoseum_icon.png' },
  reflection_prompt: { type: String, default: '' },
  guided_question: { type: String, default: '' },
  vad_scores: { type: [Number], default: [0, 0, 0] },
  title: { type: String, default: 'Untitled' },
  tags: { type: Array, default: [] },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, default: null }
});

const Diary = mongoose.model('Diary', DiarySchema, 'Emoseum');
export default Diary;
