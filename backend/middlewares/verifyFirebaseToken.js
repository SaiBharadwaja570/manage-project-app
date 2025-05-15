// middleware/verifyFirebaseToken.js
import admin from '../utils/firebase.js';
import User from '../models/user.model.js';

export const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // Check if user exists in DB
    let user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      user = await User.create({
        uid: decoded.uid,
        name: decoded.name || '',
        email: decoded.email,
      });
    }

    req.user = user; // Attach MongoDB user object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};
