import express from 'express';
import { getProfile, updateProfile, getUserById, getDashboardStats } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get active user's profile details (Protected)
router.get('/profile', verifyToken, getProfile);

// Update active user's profile details (Protected)
router.put('/profile', verifyToken, updateProfile);

// Get dashboard stats (Protected)
router.get('/dashboard-stats', verifyToken, getDashboardStats);

// Get a specific user's details by ID (Protected)
router.get('/:id', verifyToken, getUserById);

export default router;
