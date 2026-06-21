import express from 'express';
import { 
    getUsersDirectory, 
    createRequest, 
    getMyRequests, 
    updateRequestStatus 
} from '../controllers/requestController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get directory list of students/alumni (Protected)
router.get('/directory', verifyToken, getUsersDirectory);

// Send a referral/mentorship request (Protected)
router.post('/create', verifyToken, createRequest);

// Retrieve sent & received requests for the logged-in user (Protected)
router.get('/my-requests', verifyToken, getMyRequests);

// Accept or reject a received request (Protected)
router.patch('/:id/status', verifyToken, updateRequestStatus);

export default router;
