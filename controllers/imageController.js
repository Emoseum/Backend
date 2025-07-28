// controllers/imageController.js
import { uploadImageToSupabase } from '../utils/uploadImage.js';

export const handleImageUpload = async (req, res) => {
  const { emotion } = req.body;

  const localPath = `./output/${emotion}.png`;
  const fileName = `${emotion}-${Date.now()}.png`;

  try {
    const url = await uploadImageToSupabase(localPath, fileName);
    res.json({ imageUrl: url });
  } catch (err) {
    console.error('[Image Upload Error]', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
