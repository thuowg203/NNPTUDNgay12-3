const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Role = require('../schemas/roles');
const User = require('../schemas/users');

// [GET] Get all roles (not soft-deleted)
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// [GET] Get role by id
router.get('/:id', async (req, res) => {
  try {
    const roleId = req.params.id;
    if (!mongoose.isValidObjectId(roleId)) {
      return res.status(400).json({ message: `Invalid role id '${roleId}'` });
    }

    const role = await Role.findOne({ _id: roleId, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: `Role with ID ${roleId} not found` });
    }

    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// [POST] Create role
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const trimmedName = String(name).trim();
    const existed = await Role.findOne({ name: trimmedName, isDeleted: false });
    if (existed) {
      return res.status(409).json({ message: `Role with name '${trimmedName}' already exists` });
    }

    const newRole = new Role({ name: trimmedName, description });
    await newRole.save();

    res.status(201).json(newRole);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Role name already exists' });
    }
    res.status(500).json({ message: err.message });
  }
});

// [PUT] Update role
router.put('/:id', async (req, res) => {
  try {
    const roleId = req.params.id;
    if (!mongoose.isValidObjectId(roleId)) {
      return res.status(400).json({ message: `Invalid role id '${roleId}'` });
    }

    const { name, description } = req.body;
    if (!name && description === undefined) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const role = await Role.findOne({ _id: roleId, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: `Role with ID ${roleId} not found` });
    }

    if (name) {
      const trimmedName = String(name).trim();
      const existed = await Role.findOne({
        _id: { $ne: role._id },
        name: trimmedName,
        isDeleted: false,
      });
      if (existed) {
        return res.status(409).json({ message: `Role with name '${trimmedName}' already exists` });
      }
      role.name = trimmedName;
    }
    if (description !== undefined) role.description = description;

    await role.save();
    res.json(role);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Role name already exists' });
    }
    res.status(500).json({ message: err.message });
  }
});

// [DELETE] Soft delete role
router.delete('/:id', async (req, res) => {
  try {
    const roleId = req.params.id;
    if (!mongoose.isValidObjectId(roleId)) {
      return res.status(400).json({ message: `Invalid role id '${roleId}'` });
    }

    const role = await Role.findOne({ _id: roleId, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: `Role with ID ${roleId} not found` });
    }

    role.isDeleted = true;
    await role.save();

    res.json({ message: `Role '${role.name}' was soft deleted`, role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// [GET] Get all users by role id
router.get('/:id/users', async (req, res) => {
  try {

    const roleId = req.params.id;

    if (!mongoose.isValidObjectId(roleId)) {
      return res.status(400).json({
        message: `Invalid role id '${roleId}'`
      });
    }

    const users = await User.find({
      role: roleId,
      isDeleted: false
    });

    res.json(users);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});