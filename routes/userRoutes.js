// routes/userRoutes.js
import express from 'express';
import { updateUserStyle } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.patch('/style', authenticateToken, updateUserStyle);

export default router;