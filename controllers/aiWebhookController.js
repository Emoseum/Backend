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

export async function handleGalleryUpdateWebhook(req, res) {
  try {
    const { diary_id, keywords, title, guided_question, user_id } = req.body;

    if (!diary_id) {
      return res.status(400).json({ error: 'diary_id required' });
    }

    const updateFields = {
      updatedAt: new Date().toISOString()
    };

    if (keywords) updateFields.keywords = keywords;
    if (title) updateFields.title = title;
    if (guided_question) updateFields.guided_question = guided_question;

    const result = await Diary.findByIdAndUpdate(
      diary_id,
      { $set: updateFields },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Diary not found' });
    }

    console.log(`Gallery item updated for diary ${diary_id}:`, updateFields);
    res.status(200).json({ message: 'Gallery item updated successfully', diary_id });

  } catch (err) {
    console.error('Error updating gallery item:', err);
    res.status(500).json({ error: err.message });
  }
}