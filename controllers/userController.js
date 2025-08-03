import User from '../models/User.js';

export const updateUserStyle = async (req, res) => {
  const userId = req.user.userId;
  const { style } = req.body;

  if (!style) return res.status(400).json({ error: 'Style is required' });

  const updated = await User.findOneAndUpdate(
    { userId },
    { style },
    { new: true }
  );

  // AI 서버에 화풍 업데이트 알림
  try {
    const aiServerUrl = process.env.AI_SERVER_URL || 'http://localhost:8000';
    await fetch(`${aiServerUrl}/auth/update-style`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
  } catch (aiError) {
    console.warn('AI Style Update Failed :', aiError.message);
  }

  res.status(200).json({
    message: 'Style updated',
    style: updated.style
  });
};
