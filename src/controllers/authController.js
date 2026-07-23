const User = require("../models/User");
const createError = require("../utils/createError");
const { signToken } = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/password");
 
class AuthController {
  constructor() {
    this.getAuthStatus = this.getAuthStatus.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getMe = this.getMe.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }
 
  buildAuthResponse(user) {
    const token = signToken({
      id: user.id,
      role: user.role,
    });
 
    return {
      user: user.toJSON(),
      token,
    };
  }
 
  getAuthStatus(req, res) {
    res.status(200).json({
      success: true,
      message: "Auth routes are mounted",
      data: {
        routes: [
          "GET  /api/auth",
          "POST /api/auth/register",
          "POST /api/auth/login",
          "GET  /api/auth/me",
        ],
      },
    });
  }
 
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;
      const normalizedEmail = email.toLowerCase();
 
      const existingUser = await User.findOne({ email: normalizedEmail });
 
      if (existingUser) {
        return next(createError(409, "Email is already registered"));
      }
 
      const passwordHash = await hashPassword(password);
 
      const user = await User.create({
        name,
        email: normalizedEmail,
        password_hash: passwordHash,
        role: role || "user",
      });
 
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: this.buildAuthResponse(user),
      });
    } catch (error) {
      return next(error);
    }
  }
 
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase();
 
      const user = await User.findOne({ email: normalizedEmail }).select("+password_hash");
 
      if (!user) {
        return next(createError(401, "Invalid email or password"));
      }
 
      const passwordIsValid = await comparePassword(password, user.password_hash);
 
      if (!passwordIsValid) {
        return next(createError(401, "Invalid email or password"));
      }
 
      user.logged_in_at = new Date();
      await user.save();
 
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: this.buildAuthResponse(user),
      });
    } catch (error) {
      return next(error);
    }
  }
 
  getMe(req, res) {
    res.status(200).json({
      success: true,
      message: "Authenticated user",
      data: {
        user: req.user,
      },
    });
  }

  async changePassword(req, res, next) {
  try {
    const { current_password, new_password } = req.body;

    const user = await User.findById(req.user._id).select("+password_hash");
    if (!user) return next(createError(404, "User not found"));

    const isValid = await comparePassword(current_password, user.password_hash);
    if (!isValid) return next(createError(401, "Current password is incorrect"));

    user.password_hash = await hashPassword(new_password);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return next(error);
  }
}




}
 
module.exports = new AuthController();
