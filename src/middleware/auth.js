import jwt from 'jsonwebtoken';

// Middleware to verify the token
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'dojgjawjhdjogjojw'); // Decode the JWT
    req.user = decoded; // Attach decoded user data to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};