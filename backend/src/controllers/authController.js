import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Helper to generate signed JWT token for authenticated staff
 */
function generateToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET || 'rms_ice_cream_jwt_secret_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

/**
 * @description Authenticate staff via 4-digit PIN and issue JWT
 * @route POST /api/auth/pin-login
 * @access Public
 */
export async function pinLogin(req, res) {
  try {
    const { pin } = req.body;
    const user = await User.findOne({ pin, isActive: true });

    if (!user) {
      throw new Error('Invalid staff PIN. Please try again.');
    }

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token: generateToken(user),
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid staff PIN. Please try again.'
    });
  }
}

/**
 * @description Get profile of currently logged-in staff
 * @route GET /api/auth/me
 * @access Protected (Any active staff)
 */
export async function getMe(req, res) {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving staff profile',
      error: error.message
    });
  }
}

/**
 * @description Get all staff members for management and settings
 * @route GET /api/auth/staff
 * @access Protected (Manager)
 */
export async function getAllStaff(req, res) {
  try {
    const staff = await User.find({}).select('-__v');
    res.status(200).json({
      success: true,
      count: staff.length,
      staff: staff.map((s) => ({
        id: s._id,
        name: s.name,
        role: s.role,
        pin: s.pin,
        isActive: s.isActive,
        createdAt: s.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve staff directory',
      error: error.message
    });
  }
}

/**
 * @description Update a staff member's 4-digit PIN in MongoDB
 * @route PATCH /api/auth/staff/:id/pin
 * @access Protected (Manager)
 */
export async function updateStaffPin(req, res) {
  try {
    const { id } = req.params;
    const { pin } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    user.pin = pin;
    await user.save();

    res.status(200).json({
      success: true,
      message: `PIN for ${user.name} updated to ${pin}`,
      pin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update staff PIN',
      error: error.message
    });
  }
}

