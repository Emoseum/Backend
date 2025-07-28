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

  res.status(200).json({
    message: 'Style updated',
    style: updated.style
  });
};
