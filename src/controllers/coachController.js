const Coach = require("../models/Coach");
const createError = require("../utils/createError");

class CoachController {
  constructor() {
    this.listCoaches = this.listCoaches.bind(this);
    this.getCoach = this.getCoach.bind(this);
    this.createCoach = this.createCoach.bind(this);
    this.updateCoach = this.updateCoach.bind(this);
    this.deleteCoach = this.deleteCoach.bind(this);
  }

  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }

  async listCoaches(req, res, next) {
    try {
      const coaches = await Coach.find().sort({ order: 1, created_at: 1 });
      res.status(200).json({ success: true, data: coaches });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async getCoach(req, res, next) {
    try {
      const coach = await Coach.findById(req.params.id);
      if (!coach) return next(createError(404, "Coach not found"));
      res.status(200).json({ success: true, data: coach });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async createCoach(req, res, next) {
    try {
      const { name, role, experience, diplomes, specialite, image, color, order } = req.body;
      const coach = await Coach.create({
        author_id: req.user.id,
        name, role, experience, diplomes, specialite, image, color, order,
      });
      res.status(201).json({ success: true, message: "Coach created", data: coach });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async updateCoach(req, res, next) {
    try {
      const { name, role, experience, diplomes, specialite, image, color, order } = req.body;
      const updated = await Coach.findByIdAndUpdate(
        req.params.id,
        { name, role, experience, diplomes, specialite, image, color, order },
        { new: true, runValidators: true }
      );
      if (!updated) return next(createError(404, "Coach not found"));
      res.status(200).json({ success: true, message: "Coach updated", data: updated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async deleteCoach(req, res, next) {
    try {
      const deleted = await Coach.findByIdAndDelete(req.params.id);
      if (!deleted) return next(createError(404, "Coach not found"));
      res.status(200).json({ success: true, message: "Coach deleted" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

module.exports = new CoachController();