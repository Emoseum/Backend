import axios from 'axios';

export const getAIToken = async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id is required' });

  try {
    const aiRes = await axios.post(`${process.env.AI_URI}/auth/register`, {
      user_id: userId
    });

    const accessToken = aiRes.data.access_token;
    res.status(200).json({ access_token: accessToken });
  } catch (err) {
    console.error('Fail to request AI token :', err.message);
    res.status(500).json({ error: 'Fail to request AI Server' });
  }
};
