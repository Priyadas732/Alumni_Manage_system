import express from 'express';
import { 
    startConversation, 
    getConversations, 
    sendMessage, 
    getMessages 
} from '../controllers/chatController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get list of conversations for logged-in user (Protected)
router.get('/', verifyToken, getConversations);

// Create or fetch a conversation between user and recipient (Protected)
router.post('/', verifyToken, startConversation);

// Get messages thread inside a conversation (Protected)
router.get('/:id/messages', verifyToken, getMessages);

// Send message in a conversation (Protected)
router.post('/:id/messages', verifyToken, sendMessage);

export default router;
