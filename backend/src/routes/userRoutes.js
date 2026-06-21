import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get active user's profile details (Protected)
router.get('/profile', verifyToken, getProfile);

// Update active user's profile details (Protected)
router.put('/profile', verifyToken, updateProfile);

export default router;
