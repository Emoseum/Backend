// routes/authRoutes.js
import express from 'express';
import { register, login, verifyToken, getUserInfoForAI } from '../controllers/authController.js';
import { updateUserStyle } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { updateDiaryTitle, updateDiaryTags } from '../controllers/diaryController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/verify', verifyToken);

// 화풍 스타일 수정
router.patch('/style', authenticateToken, updateUserStyle);

// 이미지 제목 수정
router.patch('/diary/title/:id', authenticateToken, updateDiaryTitle);
router.patch('/diary/tags/:id', authenticateToken, updateDiaryTags);

// AI 서버용 사용자 정보 조회 (인증 X)
router.get('/user/:userId', getUserInfoForAI);

export default router;