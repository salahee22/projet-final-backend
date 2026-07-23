const User = require("../models/User");
const createError = require("../utils/createError");
const { getPagination, getPaginationMeta } = require("../utils/queryHelpers");

class UserController {
  constructor() {
    this.listUsers = this.listUsers.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async listUsers(req, res, next) {
    try {
      const filter = {};
      if (req.query.role) filter.role = req.query.role;

      const { page, limit, skip } = getPagination(req.query);
      const [total, users] = await Promise.all([
        User.countDocuments(filter),
        User.find(filter)
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit),
      ]);

      res.status(200).json({
        success: true,
        pagination: getPaginationMeta(total, page, limit, users.length),
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return next(createError(404, "User not found"));

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { name, role } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, role },
        { new: true, runValidators: true }
      );

      if (!user) return next(createError(404, "User not found"));

      res.status(200).json({ success: true, message: "User updated", data: user });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return next(createError(404, "User not found"));

      res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();