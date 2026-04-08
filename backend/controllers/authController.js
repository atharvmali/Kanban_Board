const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const sendWelcomeEmail = require("../utils/sendWelcomeEmail");
const { getResetPasswordEmailTemplate } = require("../utils/emailTemplates");

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const isStrongPassword = (password) => {
  // Minimum 8 chars with uppercase, lowercase, and number.
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    if (!isStrongPassword(password)) {
      res.status(400);
      throw new Error(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number"
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      res.status(409);
      throw new Error("Email is already registered");
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    const token = createToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

    // Fire-and-forget welcome email so registration response is never blocked.
    setImmediate(() => {
      sendWelcomeEmail(user.email, user.name).catch((emailError) => {
        console.error("Welcome email failed:", emailError.message);
      });
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const token = createToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      res.status(400);
      throw new Error("Email is required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });

      const baseUrl = process.env.FRONTEND_URL || "http://localhost:5050";
      const resetUrl = `${baseUrl}/reset-password.html?token=${resetToken}`;

      const text = `You requested a password reset. Use this link: ${resetUrl}. This link expires in 15 minutes.`;
      const html = getResetPasswordEmailTemplate({
        userName: user.name,
        resetUrl
      });

      try {
        await sendEmail({
          to: user.email,
          subject: "Kanban Password Reset",
          text,
          html
        });
      } catch (emailError) {
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save({ validateBeforeSave: false });
        throw emailError;
      }
    }

    // Generic response to prevent user enumeration attacks.
    res.json({
      message: "If an account with that email exists, a reset link has been sent."
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      res.status(400);
      throw new Error("Password and confirm password are required");
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    if (!isStrongPassword(password)) {
      res.status(400);
      throw new Error(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number"
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      throw new Error("Reset token is invalid or expired");
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
};
