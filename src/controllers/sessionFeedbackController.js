const SessionFeedback = require("../models/SessionFeedback");
const PersonalProg = require("../models/PersonalProg");
const createError = require("../utils/createError");

class SessionFeedbackController {
  constructor() {
    this.createFeedback = this.createFeedback.bind(this);
    this.listFeedbackForProgram = this.listFeedbackForProgram.bind(this);
  }

  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }

  async createFeedback(req, res, next) {
    try {
      const { program_id, week_num, day_num, feeling, load_preference, comment } = req.body;

      const prog = await PersonalProg.findById(program_id);
      if (!prog) return next(createError(404, "Programme not found"));
      if (prog.player_id.toString() !== req.user._id.toString()) {
        return next(createError(403, "Forbidden"));
      }

      const feedback = await SessionFeedback.create({
        player_id: req.user._id,
        program_id,
        week_num,
        day_num,
        feeling,
        load_preference,
        comment,
      });

      res.status(201).json({ success: true, message: "Feedback enregistré", data: feedback });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async listFeedbackForProgram(req, res, next) {
    try {
      const prog = await PersonalProg.findById(req.params.progId);
      if (!prog) return next(createError(404, "Programme not found"));

      const isCoach = prog.coach_id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";
      const isPlayer = prog.player_id.toString() === req.user._id.toString();
      if (!isCoach && !isAdmin && !isPlayer) return next(createError(403, "Forbidden"));

      const feedbacks = await SessionFeedback.find({ program_id: req.params.progId }).sort({ created_at: -1 });
      res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

module.exports = new SessionFeedbackController();