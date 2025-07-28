// controllers/questionController.js
import Question from '../models/Question.js';

export async function getRandomQuestion(req, res) {
  try {
    const random = await Question.aggregate([
      { $sample: { size: 1 } }
    ]);

    if (!random.length) {
      return res.status(404).json({ error: 'No question found' });
    }

    res.status(200).json(random[0]);
  } catch (err) {
    console.error('[getRandomQuestion] Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
}
