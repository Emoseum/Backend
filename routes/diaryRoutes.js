// routes/diaryRoutes.js
import express from 'express';
import {
  writeDiary,
  getDiaryDetail,
  getAllDiaries,
  deleteDiary,
  updateDiaryTitle,
  updateDiaryTags,
  updateDiaryFromAI,
  updateFromAISession
} from '../controllers/diaryController.js';

import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/write', authenticateToken, writeDiary);
router.post('/update', updateDiaryFromAI);
router.post('/updateFromAISession', updateFromAISession);
router.get('/all', authenticateToken, getAllDiaries);
router.get('/detail/:id', authenticateToken, getDiaryDetail); 
router.delete('/delete/:id', authenticateToken, deleteDiary);
router.patch('/title/:id', authenticateToken, updateDiaryTitle);
router.patch('/tags/:id', authenticateToken, updateDiaryTags);

export default router;
