const NutritionProg = require("../models/NutritionProg");
const PersonalProg = require("../models/PersonalProg");
const createError = require("../utils/createError");

class NutritionProgController {
  constructor() {
    this.listNutritionOfProg = this.listNutritionOfProg.bind(this);
    this.addNutritionToProg = this.addNutritionToProg.bind(this);
    this.updateNutritionProg = this.updateNutritionProg.bind(this);
    this.removeNutritionFromProg = this.removeNutritionFromProg.bind(this);
  }

  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }

  async checkProgAccess(progId, userId, role) {
    const prog = await PersonalProg.findById(progId);
    if (!prog) throw createError(404, "Programme not found");

    const isPlayer = prog.player_id.toString() === userId.toString();
    const isCoach = prog.coach_id.toString() === userId.toString();
    const isAdmin = role === "admin";

    if (!isPlayer && !isCoach && !isAdmin) throw createError(403, "Forbidden");
    return { prog, isCoach, isAdmin };
  }

  async listNutritionOfProg(req, res, next) {
    try {
      await this.checkProgAccess(req.params.progId, req.user._id, req.user.role);

      const filter = { program_id: req.params.progId };
      if (req.query.week_num) filter.week_num = Number(req.query.week_num);
      if (req.query.day_num) filter.day_num = Number(req.query.day_num);

      const entries = await NutritionProg.find(filter).sort({ week_num: 1, day_num: 1 });

      res.status(200).json({ success: true, data: entries });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async addNutritionToProg(req, res, next) {
    try {
      const { isCoach, isAdmin } = await this.checkProgAccess(req.params.progId, req.user._id, req.user.role);

      if (!isCoach && !isAdmin) {
        return next(createError(403, "Only the coach can add nutrition entries"));
      }

      const { meal_type, content, week_num, day_num } = req.body;

      const entry = await NutritionProg.create({
        program_id: req.params.progId,
        meal_type,
        content,
        week_num,
        day_num,
      });

      res.status(201).json({
        success: true,
        message: "Nutrition entry added to programme",
        data: entry,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async updateNutritionProg(req, res, next) {
    try {
      const entry = await NutritionProg.findById(req.params.id);
      if (!entry) return next(createError(404, "Entry not found"));

      const { isCoach, isAdmin } = await this.checkProgAccess(entry.program_id, req.user._id, req.user.role);

      if (!isCoach && !isAdmin) {
        return next(createError(403, "Only the coach can edit nutrition entries"));
      }

      const fields = ["meal_type", "content", "week_num", "day_num"];
      const updates = {};
      fields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

      const updated = await NutritionProg.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({ success: true, message: "Updated", data: updated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async removeNutritionFromProg(req, res, next) {
    try {
      const entry = await NutritionProg.findById(req.params.id);
      if (!entry) return next(createError(404, "Entry not found"));

      const { isCoach, isAdmin } = await this.checkProgAccess(entry.program_id, req.user._id, req.user.role);

      if (!isCoach && !isAdmin) {
        return next(createError(403, "Only the coach can remove nutrition entries"));
      }

      await NutritionProg.findByIdAndDelete(req.params.id);

      res.status(200).json({ success: true, message: "Nutrition entry removed" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

module.exports = new NutritionProgController();