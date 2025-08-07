// controllers/aiSyncController.js

import Diary from '../models/Diary.js';

// AI 서버에서 갤러리 아이템 데이터 동기화
export const syncAIGalleryItem = async (req, res) => {
  try {
    const {
      user_id,
      item_id,
      diary_text,
      emotion_analysis,
      generated_image,
      artwork_title,
      docent_message,
      journey_stage,
      is_completed
    } = req.body;

    // 기존 일기 찾기 (diary_text로 매칭)
    let diary = await Diary.findOne({ 
      userId: user_id, 
      text: diary_text 
    });

    if (!diary) {
      // 새 일기 생성
      diary = new Diary({
        userId: user_id,
        text: diary_text,
        createdAt: new Date().toISOString()
      });
    }

    // AI 데이터로 업데이트
    diary.ai_item_id = item_id;
    diary.emotion_analysis = emotion_analysis;
    diary.generated_image = generated_image;
    diary.artwork_title = artwork_title || { title: 'Untitled', reflection: '' };
    diary.docent_message = docent_message || { message: '', message_type: 'encouragement', personalization_data: {} };
    diary.journey_stage = journey_stage;
    diary.is_completed = is_completed;
    diary.updatedAt = new Date().toISOString();

    // 호환성을 위한 기존 필드 업데이트
    diary.keywords = emotion_analysis?.keywords || [];
    diary.imagePath = generated_image?.image_path || diary.imagePath;
    diary.reflection_prompt = generated_image?.prompt_used || '';
    diary.vad_scores = emotion_analysis?.vad_scores || [0, 0, 0];
    diary.title = artwork_title?.title || 'Untitled';
    diary.guided_question = docent_message?.message || '';

    await diary.save();

    res.status(200).json({
      success: true,
      message: 'AI gallery item synced successfully',
      diary_id: diary._id
    });

  } catch (error) {
    console.error('AI sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync AI gallery item',
      error: error.message
    });
  }
};