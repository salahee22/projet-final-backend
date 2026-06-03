const ExerciceProg = require("../models/ExerciceProg");
const PersonalProg = require("../models/PersonalProg");
const createError = require("../utils/createError");
 
class ExerciceProgController {
  constructor() {
    this.listExercicesOfProg = this.listExercicesOfProg.bind(this);
    this.addExerciceToProg = this.addExerciceToProg.bind(this);
    this.updateExerciceProg = this.updateExerciceProg.bind(this);
    this.removeExerciceFromProg = this.removeExerciceFromProg.bind(this);
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
 
  async listExercicesOfProg(req, res, next) {
    try {
      await this.checkProgAccess(req.params.progId, req.user._id, req.user.role);
 
      const filter = { program_id: req.params.progId };
      if (req.query.week_num) filter.week_num = Number(req.query.week_num);
      if (req.query.day_num) filter.day_num = Number(req.query.day_num);
 
      const exercices = await ExerciceProg.find(filter)
        .populate("exo_id", "title description category level img video")
        .sort({ week_num: 1, day_num: 1 });
 
      res.status(200).json({ success: true, data: exercices });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async addExerciceToProg(req, res, next) {
    try {
      const { isCoach, isAdmin } = await this.checkProgAccess(req.params.progId, req.user._id, req.user.role);
 
      if (!isCoach && !isAdmin) {
        return next(createError(403, "Only the coach can add exercices"));
      }
 
      const { exo_id, week_num, day_num } = req.body;
 
      const entry = await ExerciceProg.create({
        program_id: req.params.progId,
        exo_id,
        week_num,
        day_num,
      });
 
      const populated = await entry.populate("exo_id", "title description category level img video");
 
      res.status(201).json({
        success: true,
        message: "Exercice added to programme",
        data: populated,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async updateExerciceProg(req, res, next) {
    try {
      const entry = await ExerciceProg.findById(req.params.id);
      if (!entry) return next(createError(404, "Entry not found"));
 
      const { isCoach, isAdmin } = await this.checkProgAccess(entry.program_id, req.user._id, req.user.role);
 
      // Le joueur peut seulement marquer complete, le coach peut tout modifier
      const isPlayer = !isCoach && !isAdmin;
      const updates = {};
 
      if (isPlayer) {
        if (req.body.complete !== undefined) updates.complete = req.body.complete;
      } else {
        const fields = ["week_num", "day_num", "complete"];
        fields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
      }
 
      const updated = await ExerciceProg.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      }).populate("exo_id", "title description category level img video");
 
      res.status(200).json({ success: true, message: "Updated", data: updated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async removeExerciceFromProg(req, res, next) {
    try {
      const entry = await ExerciceProg.findById(req.params.id);
      if (!entry) return next(createError(404, "Entry not found"));
 
      const { isCoach, isAdmin } = await this.checkProgAccess(entry.program_id, req.user._id, req.user.role);
 
      if (!isCoach && !isAdmin) {
        return next(createError(403, "Only the coach can remove exercices"));
      }
 
      await ExerciceProg.findByIdAndDelete(req.params.id);
 
      res.status(200).json({ success: true, message: "Exercice removed from programme" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}
 
module.exports = new ExerciceProgController();