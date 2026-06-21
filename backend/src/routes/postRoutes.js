import express from 'express';
import { 
    createPost, 
    getPosts, 
    toggleLike, 
    addComment 
} from '../controllers/postController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get experience feed (Protected)
router.get('/', verifyToken, getPosts);

// Create a new post (Protected)
router.post('/', verifyToken, createPost);

// Toggle a like on a post (Protected)
router.post('/:id/like', verifyToken, toggleLike);

// Comment on a post (Protected)
router.post('/:id/comment', verifyToken, addComment);

export default router;
