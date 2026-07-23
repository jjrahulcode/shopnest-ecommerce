// This file contains the logic for user signup, login, and profile handling

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signupUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("A user with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login existing user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.name = req.body.name || user.name;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      phone: updatedUser.phone,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signupUser, loginUser, getProfile, updateProfile };
