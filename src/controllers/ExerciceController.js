const Exercice = require("../models/Exercice");
const createError = require("../utils/createError");
const { escapeRegex, getPagination, getPaginationMeta } = require("../utils/queryHelpers");
 
class ExerciceController {
  constructor() {
    this.listExercices = this.listExercices.bind(this);
    this.getExercice = this.getExercice.bind(this);
    this.createExercice = this.createExercice.bind(this);
    this.updateExercice = this.updateExercice.bind(this);
    this.deleteExercice = this.deleteExercice.bind(this);
  }
 
  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }
 
  async listExercices(req, res, next) {
    try {
      const filter = {};
      const search = req.query.search || req.query.q;
 
      if (search) {
        filter.$or = [
          { title: new RegExp(escapeRegex(String(search).trim()), "i") },
          { description: new RegExp(escapeRegex(String(search).trim()), "i") },
        ];
      }
 
      if (req.query.category) filter.category = req.query.category;
      if (req.query.level) filter.level = req.query.level;
      if (req.query.is_goalkeeper !== undefined) {
        filter.is_goalkeeper = req.query.is_goalkeeper === "true";
      }
 
      const { page, limit, skip } = getPagination(req.query);
      const [total, exercices] = await Promise.all([
        Exercice.countDocuments(filter),
        Exercice.find(filter)
          .populate("author_id", "name role")
          .sort({ published_at: -1 })
          .skip(skip)
          .limit(limit),
      ]);
 
      res.status(200).json({
        success: true,
        pagination: getPaginationMeta(total, page, limit, exercices.length),
        data: exercices,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async getExercice(req, res, next) {
    try {
      const exercice = await Exercice.findById(req.params.id).populate("author_id", "name role");
 
      if (!exercice) {
        return next(createError(404, "Exercice not found"));
      }
 
      res.status(200).json({ success: true, data: exercice });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async createExercice(req, res, next) {
    try {
      const { title, description, category, img, video, level, is_goalkeeper, equipements } = req.body;
 
      const exercice = await Exercice.create({
        author_id: req.user._id,
        title,
        description,
        category,
        img,
        video,
        level,
        is_goalkeeper,
        equipements,
      });
 
      const populated = await exercice.populate("author_id", "name role");
 
      res.status(201).json({
        success: true,
        message: "Exercice created",
        data: populated,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async updateExercice(req, res, next) {
    try {
      const exercice = await Exercice.findById(req.params.id);
 
      if (!exercice) {
        return next(createError(404, "Exercice not found"));
      }
 
      const isOwner = exercice.author_id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";
 
      if (!isOwner && !isAdmin) {
        return next(createError(403, "Forbidden: you can only edit your own exercices"));
      }
 
      const fields = ["title", "description", "category", "img", "video", "level", "is_goalkeeper", "equipements"];
      const updates = {};
      fields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
 
      const updated = await Exercice.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      }).populate("author_id", "name role");
 
      res.status(200).json({ success: true, message: "Exercice updated", data: updated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async deleteExercice(req, res, next) {
    try {
      const exercice = await Exercice.findById(req.params.id);
 
      if (!exercice) {
        return next(createError(404, "Exercice not found"));
      }
 
      const isOwner = exercice.author_id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";
 
      if (!isOwner && !isAdmin) {
        return next(createError(403, "Forbidden: you can only delete your own exercices"));
      }
 
      await Exercice.findByIdAndDelete(req.params.id);
 
      res.status(200).json({ success: true, message: "Exercice deleted" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}
 
module.exports = new ExerciceController();
