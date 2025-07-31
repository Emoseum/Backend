// routes/aiWebhookRoutes.js
import express from 'express';
import { handleAIWebhook } from '../controllers/aiWebhookController.js';

const router = express.Router();

router.post('/diary-update', handleAIWebhook);

export default router;