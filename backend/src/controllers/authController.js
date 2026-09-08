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
    const { pin, role, userId } = req.body;

    if (!pin || typeof pin !== 'string' || pin.trim().length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'A valid 4-digit PIN is required'
      });
    }

    let matchedUser = null;

    if (userId) {
      const user = await User.findOne({ _id: userId, isActive: true });
      if (user && (await user.matchPin(pin))) {
        matchedUser = user;
      }
    } else if (role) {
      const usersInRole = await User.find({ role, isActive: true });
      for (const user of usersInRole) {
        if (await user.matchPin(pin)) {
          matchedUser = user;
          break;
        }
      }
    } else {
      // Direct PIN entry on numeric keypad: match against active staff
      const activeStaff = await User.find({ isActive: true });
      for (const user of activeStaff) {
        if (await user.matchPin(pin)) {
          matchedUser = user;
          break;
        }
      }
    }

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid staff PIN. Please try again.'
      });
    }

    const token = generateToken(matchedUser);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${matchedUser.name}!`,
      token,
      user: {
        id: matchedUser._id,
        name: matchedUser.name,
        role: matchedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during PIN authentication',
      error: error.message
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
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving staff profile',
      error: error.message
    });
  }
}
