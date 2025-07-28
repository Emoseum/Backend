// middleware/authenticateToken.js
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET;

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token does not exist' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = decoded;
    next();
  });
}
