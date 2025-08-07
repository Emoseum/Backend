// routes/aiSyncRoutes.js

import express from 'express';
import { syncAIGalleryItem } from '../controllers/aiSyncController.js';

const router = express.Router();

// AI 서버에서 갤러리 아이템 동기화
router.post('/gallery-item', syncAIGalleryItem);

export default router;