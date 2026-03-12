const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const User = require('../schemas/users');
const Role = require('../schemas/roles');

// [GET] Get all users (not soft-deleted)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// [GET] Get user by id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: `Invalid user id '${userId}'` });
    }

    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// [POST] Create user
router.post('/', async (req, res) => {
  try {
    const { username, password, email, role, fullName, avatarUrl, status } = req.body;

    if (!username || !password || !email || !role) {
      return res.status(400).json({ message: 'Username, password, email, and role are required' });
    }

    const trimmedUsername = String(username).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    const existedUsername = await User.findOne({ username: trimmedUsername, isDeleted: false });
    if (existedUsername) {
      return res.status(409).json({ message: `Username '${trimmedUsername}' already exists` });
    }

    const existedEmail = await User.findOne({ email: normalizedEmail, isDeleted: false });
    if (existedEmail) {
      return res.status(409).json({ message: `Email '${normalizedEmail}' already exists` });
    }

    if (!mongoose.isValidObjectId(role)) {
      return res.status(400).json({ message: `Invalid role id '${role}'` });
    }

    const roleDoc = await Role.findOne({ _id: role, isDeleted: false });
    if (!roleDoc) {
      return res.status(400).json({ message: `Role with ID '${role}' not found or is deleted` });
    }

    const newUser = new User({
      username: trimmedUsername,
      password,
      email: normalizedEmail,
      role,
      fullName,
      avatarUrl,
      status: status === true,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: err.message });
  }
});

// [PUT] Update user
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: `Invalid user id '${userId}'` });
    }

    const { fullName, avatarUrl, status, role } = req.body;
    if (fullName === undefined && avatarUrl === undefined && status === undefined && role === undefined) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (status !== undefined) user.status = status === true;

    if (role !== undefined) {
      if (!mongoose.isValidObjectId(role)) {
        return res.status(400).json({ message: `Invalid role id '${role}'` });
      }
      const roleDoc = await Role.findOne({ _id: role, isDeleted: false });
      if (!roleDoc) {
        return res.status(400).json({ message: `Role with ID '${role}' not found or is deleted` });
      }
      user.role = role;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// [DELETE] Soft delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: `Invalid user id '${userId}'` });
    }

    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    user.isDeleted = true;
    await user.save();

    res.json({ message: `User '${user.username}' was soft deleted`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


// [POST] Enable user by email + username
router.post('/enable', async (req, res) => {
  try {

    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        message: "Email và username là bắt buộc"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      username: username,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        message: "User không tồn tại"
      });
    }

    user.status = true;

    await user.save();

    res.json({
      message: "User đã được kích hoạt",
      user: user
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// [POST] Disable user by email + username
router.post('/disable', async (req, res) => {
  try {

    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        message: "Email và username là bắt buộc"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      username: username,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        message: "User không tồn tại"
      });
    }

    user.status = false;

    await user.save();

    res.json({
      message: "User đã bị vô hiệu hóa",
      user
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});