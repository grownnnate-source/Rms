import express from 'express';
import { pinLogin, getMe, getAllStaff, updateStaffPin } from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public: Staff PIN login
router.post('/pin-login', pinLogin);

// Protected: Get currently authenticated staff profile
router.get('/me', protect, getMe);

// Protected (Manager): Staff directory and PIN management
router.get('/staff', protect, authorize('manager'), getAllStaff);
router.patch('/staff/:id/pin', protect, authorize('manager'), updateStaffPin);

export default router;

