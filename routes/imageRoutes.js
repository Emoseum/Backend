// routes/imageRoutes.js
import express from 'express';
import { handleImageUpload } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', handleImageUpload);

export default router;
