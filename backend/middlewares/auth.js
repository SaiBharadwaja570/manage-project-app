import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

import dotenv from 'dotenv'

dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    // 1. Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('Authorization header missing');
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // 2. Check if it starts with Bearer
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Authorization header does not start with Bearer');
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    // 3. Extract the token
    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    if (!token) {
      console.log('Token is empty');
      return res.status(401).json({ message: 'Token not provided' });
    }

    // 4. Verify the token
    let decoded;
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET environment variable not set!');
        return res.status(500).json({ message: 'Server configuration error' });
      }
      decoded = jwt.verify(token, jwtSecret);
      console.log('Decoded Token:', decoded);
    } catch (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }

    // 5. Find the user
    try {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('User not found for ID:', decoded.id);
        return res.status(404).json({ message: 'User not found' });
      }

      // 6. Set the user in the request
      req.user = user;
      console.log('Authenticated User:', req.user.name, req.user._id);

      // 7. Proceed to the next middleware or route handler
      next();

    } catch (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ message: 'Error finding user', error: err.message });
    }

  } catch (err) {
    console.error('Authentication middleware error:', err);
    res.status(500).json({ message: 'Authentication middleware error', error: err.message });
  }
};