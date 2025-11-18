// controllers/userController.js
const User = require('../models/user'); 

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, role, bio } = req.body;
    if (!name || !email) return res.status(400).json({ ok: false, error: 'name and email are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ ok: false, error: 'Email already exists' });

    const user = await User.create({ name, email, role, bio });
    return res.status(201).json({ ok: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all users (with pagination & search)
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 25 } = req.query;
    const filter = q ? { $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }] } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
    ]);

    res.json({ ok: true, total, page: Number(page), limit: Number(limit), users });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single user by id
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
    res.json({ ok: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Update user (partial)
 */
exports.updateUser = async (req, res, next) => {
  try {
    const updates = (({ name, email, role, bio }) => ({ name, email, role, bio }))(req.body);
    Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k]);

    if (updates.email) {
      const exists = await User.findOne({ email: updates.email, _id: { $ne: req.params.id } });
      if (exists) return res.status(409).json({ ok: false, error: 'Email already in use by another user' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
    res.json({ ok: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
    res.json({ ok: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};


exports.deleteUserField = async (req, res, next) => {
  try {
    const { id } = req.query;        // user ID
    const { field } = req.body;       // field name to delete

    if (!field) {
      return res.status(400).json({ ok: false, error: "Field name is required" });
    }
    console.log("Field to delete:", id);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $unset: { [field]: "" } },    // remove the field
      { new: true }                   // return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    res.json({ ok: true, message: "Field removed", user: updatedUser });

  } catch (err) {
    next(err);
  }
};
