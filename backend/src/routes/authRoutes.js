import express from 'express';
import { pinLogin, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public: Staff PIN login
router.post('/pin-login', pinLogin);

// Protected: Get currently authenticated staff profile
router.get('/me', protect, getMe);

export default router;
