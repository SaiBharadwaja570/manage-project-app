const express = require('express');
const router = express.Router();
const { signup, login, getCurrentUser } = require('../controllers/authController');
const { verifyJWT } = require('../utils/jwt.js');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyJWT, getCurrentUser);

module.exports = router;
