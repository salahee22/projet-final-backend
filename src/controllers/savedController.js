const Saved = require("../models/Saved");
const createError = require("../utils/createError");
const { getPagination, getPaginationMeta } = require("../utils/queryHelpers");
 
class SavedController {
  constructor() {
    this.listSaved = this.listSaved.bind(this);
    this.addSaved = this.addSaved.bind(this);
    this.removeSaved = this.removeSaved.bind(this);
  }
 
  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }
 
  async listSaved(req, res, next) {
    try {
      const filter = { user_id: req.user._id };
 
      if (req.query.content_type) {
        filter.content_type = req.query.content_type;
      }
 
      const { page, limit, skip } = getPagination(req.query);
      const [total, saved] = await Promise.all([
        Saved.countDocuments(filter),
        Saved.find(filter)
          .sort({ saved_at: -1 })
          .skip(skip)
          .limit(limit),
      ]);
 
      res.status(200).json({
        success: true,
        pagination: getPaginationMeta(total, page, limit, saved.length),
        data: saved,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async addSaved(req, res, next) {
    try {
      const { content_id, content_type } = req.body;
 
      const existing = await Saved.findOne({
        user_id: req.user._id,
        content_id,
        content_type,
      });
 
      if (existing) {
        return next(createError(409, "Already saved"));
      }
 
      const saved = await Saved.create({
        user_id: req.user._id,
        content_id,
        content_type,
      });
 
      res.status(201).json({
        success: true,
        message: "Content saved",
        data: saved,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async removeSaved(req, res, next) {
    try {
      const { content_id, content_type } = req.query;
 
      const saved = await Saved.findOneAndDelete({
        user_id: req.user._id,
        content_id,
        content_type,
      });
 
      if (!saved) {
        return next(createError(404, "Saved item not found"));
      }
 
      res.status(200).json({ success: true, message: "Removed from saved" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}
 
module.exports = new SavedController();