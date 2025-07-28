// routes/diaryRoutes.js
import express from 'express';
import {
  writeDiary,
  getDiaryDetail,
  getAllDiaries,
  deleteDiary,
  updateDiaryTitle,
  updateDiaryTags
} from '../controllers/diaryController.js';

import { authenticateToken } from '../middleware/authenticateToken.js';
//import { processDiaryWithAI } from '../controllers/diaryAIController.js';

const router = express.Router();

router.post('/write', authenticateToken, writeDiary);
router.get('/all', authenticateToken, getAllDiaries);
router.get('/detail/:id', authenticateToken, getDiaryDetail); 
router.delete('/delete/:id', authenticateToken, deleteDiary);
router.patch('/title/:id', authenticateToken, updateDiaryTitle);
router.patch('/tags/:id', authenticateToken, updateDiaryTags);

//router.post('/process-ai/:id', authenticateToken, processDiaryWithAI);

export default router;
