// controllers/aiWebhookController.js
import Diary from '../models/Diary.js';

export async function handleAIWebhook(req, res) {
  try {
    const { diary_id, image_path, keywords, primary_emotion } = req.body;

    if (!diary_id) {
      return res.status(400).json({ error: 'diary_id required' });
    }

    const result = await Diary.findByIdAndUpdate(
      diary_id,
      {
        $set: {
          imagePath: image_path,
          keywords: keywords || [],
          title: primary_emotion,
          updatedAt: new Date().toISOString()
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Diary not found' });
    }

    res.status(200).json({ message: 'Diary updated successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}