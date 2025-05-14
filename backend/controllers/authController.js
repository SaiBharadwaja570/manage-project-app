import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import admin from '../utils/firebase.js';

export const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            message: 'Signup successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Signup failed', error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

// The getCurrentUser function now expects req.user to be set by the authenticate middleware
export const getCurrentUser = async (req, res) => {
    try {
        // req.user is set by the authenticate middleware
        res.status(200).json({ 
            id: req.user._id, 
            name: req.user.name, 
            email: req.user.email, 
            role: req.user.role 
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err.message });
    }
};

export const firebaseLogin = async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name } = decodedToken;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: name || 'Firebase User',
                email,
                password: 'firebase-auth',
                role: 'developer',
            });
        }

        // Generate JWT token for firebase user as well
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Firebase login success',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token, // Return token to client
        });
    } catch (err) {
        res.status(401).json({ message: 'Firebase token invalid', error: err.message });
    }
};