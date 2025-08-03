// controllers/diaryAIController.js

import axios from 'axios';
import supabase from '../utils/supabaseClient.js';
import Diary from '../models/Diary.js';

export async function generateDiaryMedia(req, res) {
  try {
    const { diaryId, text } = req.body;

    if (!diaryId || !text) {
      return res.status(400).json({ error: 'Missing diaryId or text' });
    }

    // 키워드 추출 요청
    const keywordRes = await axios.post(process.env.AI_KEYWORD_URL, { text });
    const keywords = keywordRes.data.keywords || [];

    // 이미지 생성 요청 → base64 반환
    const imageRes = await axios.post(process.env.AI_IMAGE_URL, { keywords });
    const base64Image = imageRes.data.image;
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // Supabase에 업로드
    const fileName = `diary_${diaryId}_${Date.now()}.png`;
    const { data, error } = await supabase.storage
      .from('emoseum-images')
      .upload(`generated/${fileName}`, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error('Supabase upload error:', error.message);
      return res.status(500).json({ error: 'Image upload failed' });
    }

    // Supabase URL 가져오기
    const { data: urlData } = supabase.storage
      .from('emoseum-images')
      .getPublicUrl(`generated/${fileName}`);
    const publicUrl = urlData.publicUrl;

    // Diary 업데이트
    const updated = await Diary.findByIdAndUpdate(
      diaryId,
      {
        imagePath: publicUrl,
        keywords,
        updatedAt: new Date().toISOString()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Diary not found' });
    }

    res.status(200).json({
      message: 'Diary media updated',
      imagePath: publicUrl,
      keywords
    });

  } catch (err) {
    console.error('[generateDiaryMedia] Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}