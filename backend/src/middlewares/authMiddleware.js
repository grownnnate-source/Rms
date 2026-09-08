import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @description Verifies JWT in Authorization header and attaches active user to req.user
 */
export async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'rms_ice_cream_jwt_secret_key_2026'
    );

    const user = await User.findById(decoded.id).select('-pin');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: User account no longer exists'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account deactivated: Contact manager for access'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Token is invalid or expired'
    });
  }
}

/**
 * @description Restricts access to specific staff roles (RBAC)
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user?.role || 'unknown'}' is not authorized for this action`
      });
    }
    next();
  };
}
