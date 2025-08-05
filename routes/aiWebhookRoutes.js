// routes/aiWebhookRoutes.js
import express from 'express';
import { handleAIWebhook, handleGalleryUpdateWebhook } from '../controllers/aiWebhookController.js';

const router = express.Router();

router.post('/diary-update', handleAIWebhook);
router.post('/gallery-update', handleGalleryUpdateWebhook);

export default router;