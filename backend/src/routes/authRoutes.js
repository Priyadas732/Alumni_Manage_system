import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

//route for user resgistration
router.post("/register", register);

//Route for user login
router.post("/login", login);

export default router;

