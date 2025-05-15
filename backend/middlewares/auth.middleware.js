import admin from '../utils/firebase.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Add Firebase UID and email to request for use in controllers
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || 'Anonymous'
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid Token', error: error.message });
  }
};

export default authMiddleware;
