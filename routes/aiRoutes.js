import express from 'express';
import { getAIToken } from '../controllers/aiController.js';

const router = express.Router();
router.get('/ai-token', getAIToken);

export default router;
