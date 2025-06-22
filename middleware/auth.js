import jwt from 'jsonwebtoken';
import User from '../models/User';
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id username');
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
export default authenticate;
