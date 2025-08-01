// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const SECRET_KEY = process.env.JWT_SECRET;

// 자동 로그인 - 토큰 유효성 검사 기반
export const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ valid: true, userId: decoded.userId });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
};

// 회원가입
export const register = async (req, res) => {
  const { userId, password } = req.body;

  const existing = await User.findOne({ userId });
  if (existing) return res.status(409).json({ message: 'This account already exists' });

  const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱

  const user = new User({
    userId,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  });

  await user.save();
  res.status(201).json({ message: 'Join Successed' });
};

// 로그인
export const login = async (req, res) => {
  const { userId, password } = req.body;

  const user = await User.findOne({ userId });
  if (!user) return res.status(404).json({ message: 'Account does not exist' });

  const isMatch = await bcrypt.compare(password, user.password); // 해시된 비밀번호 비교
  if (!isMatch) return res.status(401).json({ message: 'Invalid Password' });

  // JWT 토큰 발급
  const token = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '7d' });

  res.json({
    message: 'Login Successed',
    token,
    userId: user.userId
  });
};

// AI 서버용 사용자 정보 조회 (인증 없이)
export const getUserInfoForAI = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      userId: user.userId,
      style: user.style || [],
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
