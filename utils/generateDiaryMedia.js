// utils/generateDiaryMedia.js

import Diary from '../models/Diary.js';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * 일기 텍스트 기반으로 AI에서 이미지 + 키워드 생성하고 Supabase에 업로드,
 * MongoDB에 imagePath, title, keywords만 저장
 */

export async function generateDiaryMedia(diaryId, text) {
  try {
    // AI 서버 호출 → 이미지(base64) + 제목 + 키워드 받기
    const aiRes = await fetch(`${process.env.AI_SERVER_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!aiRes.ok) throw new Error('AI Server Error');

    const { imageBase64, title, keywords } = await aiRes.json();

    // base64 → Buffer 변환
    const buffer = Buffer.from(imageBase64, 'base64');
    const fileName = `diary_${diaryId}_${Date.now()}.png`;

    // Supabase 업로드
    const { data, error } = await supabase.storage
      .from('emoseum-images')
      .upload(`generated/${fileName}`, buffer
      , {
        contentType: 'image/png',
        upsert: true
        
      });

    if (error) throw new Error(`Supabase Upload Failed : ${error.message}`);

    const { data: urlData } = supabase
      .storage
      .from('emoseum-images')
      .getPublicUrl(`generated/${fileName}`);

    const imageUrl = urlData.publicUrl;

    // MongoDB 업데이트 (tags는 저장하지 않음!)
    await Diary.findByIdAndUpdate(diaryId, {
      imagePath: imageUrl,
      title,
      keywords,
      updatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('generateDiaryMedia error:', err.message);
    throw err;
  }
}
