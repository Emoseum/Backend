// routes/questionRoutes.js
import express from 'express';
import { getRandomQuestion } from '../controllers/questionController.js';

const router = express.Router();

router.get('/random', getRandomQuestion);

export default router;
