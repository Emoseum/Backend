//controllers/diaryController.js
import Diary from '../models/Diary.js';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

// 일기 작성
export async function writeDiary(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const jwtKey = process.env.JWT_SECRET;
    const secretKey = process.env.SECRET_KEY;
    if (!jwtKey || !secretKey) return res.status(500).json({ error: 'Missing keys' });

    const decoded = jwt.verify(token, jwtKey);
    const userId = decoded.userId;

    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const encryptedText = CryptoJS.AES.encrypt(text, secretKey).toString();
    const placeholderImage = 'https://fbffiyvnxkshgxepiimj.supabase.co/storage/v1/object/public/emoseum-images/emoseum_icon.png';

    const diary = new Diary({
      userId,
      text: encryptedText,
      imagePath: placeholderImage,
      createdAt: new Date().toISOString()
    });

    const savedDiary = await diary.save();

    res.status(200).json({
      _id: savedDiary._id,
      message: 'Diary saved!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 일기 상세 조회
export async function getDiaryDetail(req, res) {
  try {
    const { id } = req.params;
    const secretKey = process.env.SECRET_KEY;

    const diary = await Diary.findById(id);
    if (!diary) return res.status(404).json({ error: 'Diary not found' });

    const decryptedText = CryptoJS.AES.decrypt(diary.text, secretKey).toString(CryptoJS.enc.Utf8);

    // guided_question 콘솔 출력
    if (diary.guided_question) {
      console.log(`[Diary ${id}] Guided Question:`, diary.guided_question);
    } else {
      console.log(`[Diary ${id}] No guided question available`);
    }

    res.status(200).json({
      _id: diary._id,
      userId: diary.userId,
      text: decryptedText,
      keywords: diary.keywords || [],
      imagePath: diary.imagePath,
      guided_question: diary.guided_question || '',
      createdAt: diary.createdAt,
      updatedAt: diary.updatedAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 일기 전체 조회 (복호화 O)
export async function getAllDiaries(req, res) {
  try {
    const userId = req.user?.userId;
    const secretKey = process.env.SECRET_KEY;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const diaries = await Diary.find({ userId }).sort({ createdAt: -1 });

    const response = diaries.map(d => {
      const decryptedText = CryptoJS.AES.decrypt(d.text, secretKey).toString(CryptoJS.enc.Utf8);

      return {
        _id: d._id,
        text: decryptedText,
        title: d.title || null,
        tags: d.tags || [],
        keywords: d.keywords || [],
        imagePath: d.imagePath,
        createdAt: d.createdAt
      };
    });

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 일기 삭제
export async function deleteDiary(req, res) {
  try {
    const userId = req.user?.userId;
    const diaryId = req.params.id;

    if (!userId || !diaryId) {
      return res.status(400).json({ error: 'Missing userId or diaryId' });
    }

    const result = await Diary.deleteOne({ _id: new ObjectId(diaryId), userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Diary not found or unauthorized' });
    }

    res.status(200).json({ message: 'Diary deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 일기 제목 업데이트
export async function updateDiaryTitle(req, res) {
  try {
    const userId = req.user?.userId;
    const diaryId = req.params.id;
    const { title } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Invalid title' });
    }

    const result = await Diary.findOneAndUpdate(
      { _id: new ObjectId(diaryId), userId },
      {
        $set: {
          title,
          updatedAt: new Date().toISOString()
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Diary not found or unauthorized' });
    }

    res.status(200).json({ message: 'Title updated', title: result.title });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 일기 해시태그 업데이트
export async function updateDiaryTags(req, res) {
  try {
    const userId = req.user?.userId;
    const diaryId = req.params.id;
    const { tags } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!Array.isArray(tags)) return res.status(400).json({ error: 'Tags must be an array' });

    const result = await Diary.findOneAndUpdate(
      { _id: new ObjectId(diaryId), userId },
      {
        $set: {
          tags,
          updatedAt: new Date().toISOString()
        }
      },
      { new: true }
    );

    if (!result) return res.status(404).json({ error: 'Diary not found or unauthorized' });

    res.status(200).json({ message: 'Tags updated', tags: result.tags });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// AI에서 일기 업데이트
export async function updateDiaryFromAI(req, res) {
  try {
    const { diary_id, title, keywords, guided_question } = req.body;
    console.log('[서버] 받은 요청 body:', req.body);

    if (!diary_id) {
      return res.status(400).json({ error: 'Missing diary_id' });
    }

    // 업데이트할 필드들 준비
    const updateFields = {
      updatedAt: new Date().toISOString()
    };

    // 각 필드가 존재하면 업데이트 객체에 추가
    if (title !== undefined) updateFields.title = title;
    if (keywords !== undefined) {
      // keywords가 문자열이면 배열로 변환
      updateFields.keywords = typeof keywords === 'string' ? keywords.split(',') : keywords;
    }
    if (guided_question !== undefined) updateFields.guided_question = guided_question;

    const result = await Diary.findByIdAndUpdate(
      diary_id,
      { $set: updateFields },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Diary not found' });
    }

    res.status(200).json({ 
      message: 'Diary updated successfully',
      diary: result 
    });

  } catch (err) {
    console.error('서버 오류:', err);
    res.status(500).json({ error: err.message });
  }
}

// AI 서버에서 일기 업데이트 받는 함수
export async function updateFromAISession(req, res) {
  try {
    const { diary_id, keywords, imagePath, reflection_prompt } = req.body;
    
    // MongoDB에서 해당 일기 업데이트
    const result = await Diary.findByIdAndUpdate(
      diary_id,
      { 
        keywords: keywords,
        imagePath: imagePath,
        reflection_prompt: reflection_prompt || '',
        updatedAt: new Date().toISOString()
      },
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ success: false, error: 'Diary not found' });
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating diary from AI:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}