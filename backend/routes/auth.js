import express from 'express';
import User from '../models/User.js';
import admin from '../config/firebase.js';

const router = express.Router();

// Login or register user
router.post('/login', async (req, res) => {
  try {
    const { id, name, email, photoURL } = req.body;
    
    // Check if user exists
    let user = await User.findById(id);
    
    if (!user) {
      // Create new user
      user = new User({
        _id: id,
        name,
        email,
        photoURL
      });
      
      await user.save();
    } else {
      // Update existing user
      user.name = name;
      user.photoURL = photoURL;
      await user.save();
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;