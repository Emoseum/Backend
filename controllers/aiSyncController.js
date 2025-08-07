// controllers/aiSyncController.js

import Diary from '../models/Diary.js';

// AI 서버에서 갤러리 아이템 데이터 동기화
export const syncAIGalleryItem = async (req, res) => {
  try {
    const {
      user_id,
      item_id,
      created_date,
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
        createdAt: created_date || new Date().toISOString()
      });
    }

    // AI 데이터로 업데이트 (타입 변환 포함)
    diary.ai_item_id = item_id;
    
    if (emotion_analysis) {
      diary.emotion_analysis = {
        ...emotion_analysis,
        intensity: typeof emotion_analysis.intensity === 'string' ? 0.5 : emotion_analysis.intensity
      };
    }
    
    diary.generated_image = generated_image || {};
    diary.artwork_title = artwork_title || { title: 'Untitled', reflection: '' };
    diary.docent_message = docent_message || { message: '', message_type: 'encouragement', personalization_data: {} };
    diary.journey_stage = journey_stage || 'the_moment';
    diary.is_completed = is_completed || false;
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

// AI 서버에서 갤러리 아이템 업데이트 (제목, 도슨트 메시지 등)
export const updateAIGalleryItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updateData = req.body;

    // ai_item_id로 일기 찾기
    const diary = await Diary.findOne({ ai_item_id: itemId });

    if (!diary) {
      return res.status(404).json({
        success: false,
        message: 'Diary not found with given AI item ID'
      });
    }

    // 업데이트 데이터 적용
    if (updateData.emotion_analysis) {
      const updatedEmotion = {
        ...diary.emotion_analysis.toObject(),
        ...updateData.emotion_analysis
      };
      // intensity 타입 변환
      if (typeof updatedEmotion.intensity === 'string') {
        updatedEmotion.intensity = 0.5;
      }
      diary.emotion_analysis = updatedEmotion;
      diary.keywords = updateData.emotion_analysis.keywords || diary.keywords;
      diary.vad_scores = updateData.emotion_analysis.vad_scores || diary.vad_scores;
    }

    if (updateData.generated_image) {
      diary.generated_image = {
        ...diary.generated_image.toObject(),
        ...updateData.generated_image
      };
      diary.imagePath = updateData.generated_image.image_path || diary.imagePath;
      diary.reflection_prompt = updateData.generated_image.prompt_used || diary.reflection_prompt;
    }

    if (updateData.artwork_title) {
      diary.artwork_title = updateData.artwork_title;
      diary.title = updateData.artwork_title.title;
    }

    if (updateData.docent_message) {
      diary.docent_message = updateData.docent_message;
      diary.guided_question = updateData.docent_message.message;
    }

    if (updateData.journey_stage) {
      diary.journey_stage = updateData.journey_stage;
    }

    if (updateData.is_completed !== undefined) {
      diary.is_completed = updateData.is_completed;
    }

    if (updateData.ai_json) {
      console.log('[DEBUG] 받은 AI JSON 데이터:', JSON.stringify(updateData.ai_json, null, 2));
      diary.ai_json = updateData.ai_json;
      console.log('[DEBUG] DB에 저장된 AI JSON:', diary.ai_json ? 'SUCCESS' : 'FAILED');
    } else {
      console.log('[DEBUG] ai_json 데이터가 없음');
    }

    diary.updatedAt = new Date().toISOString();
    await diary.save();

    res.status(200).json({
      success: true,
      message: 'AI gallery item updated successfully',
      diary_id: diary._id
    });

  } catch (error) {
    console.error('AI update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update AI gallery item',
      error: error.message
    });
  }
};