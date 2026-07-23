const PersonalProg = require("../models/PersonalProg");
const createError = require("../utils/createError");
const { getPagination, getPaginationMeta } = require("../utils/queryHelpers");

class PersonalProgController {
  constructor() {
    this.listMyProgs = this.listMyProgs.bind(this);
    this.getProg = this.getProg.bind(this);
    this.createProg = this.createProg.bind(this);
    this.updateProg = this.updateProg.bind(this);
    this.deleteProg = this.deleteProg.bind(this);
  }

  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }

  // Le joueur voit ses propres programmes, le coach voit ceux qu'il a créés
  async listMyProgs(req, res, next) {
    try {
      const isCoach = req.user.role === "coach" || req.user.role === "admin";
      const filter = isCoach
        ? { coach_id: req.user._id }
        : { player_id: req.user._id };

      // un coach peut filtrer par joueur
      if (isCoach && req.query.player_id) {
        filter.player_id = req.query.player_id;
      }

      const { page, limit, skip } = getPagination(req.query);
      const [total, progs] = await Promise.all([
        PersonalProg.countDocuments(filter),
        PersonalProg.find(filter)
          .populate("player_id", "name email")
          .populate("coach_id", "name email")
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit),
      ]);

      res.status(200).json({
        success: true,
        pagination: getPaginationMeta(total, page, limit, progs.length),
        data: progs,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async getProg(req, res, next) {
    try {
      const prog = await PersonalProg.findById(req.params.id)
        .populate("player_id", "name email")
        .populate("coach_id", "name email");

      if (!prog) {
        return next(createError(404, "Programme not found"));
      }

      const isPlayer = prog.player_id._id.toString() === req.user._id.toString();
      const isCoach = prog.coach_id._id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";

      if (!isPlayer && !isCoach && !isAdmin) {
        return next(createError(403, "Forbidden"));
      }

      res.status(200).json({ success: true, data: prog });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async createProg(req, res, next) {
    try {
      const isCoach = req.user.role === "coach" || req.user.role === "admin";

      if (!isCoach) {
        return next(createError(403, "Only coaches can create programmes"));
      }

      const { player_id, description, videos, image } = req.body;

      const prog = await PersonalProg.create({
        player_id,
        coach_id: req.user._id,
        description,
        videos,
        image,
      });

      const populated = await prog.populate([
        { path: "player_id", select: "name email" },
        { path: "coach_id", select: "name email" },
      ]);

      res.status(201).json({
        success: true,
        message: "Programme created",
        data: populated,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async updateProg(req, res, next) {
    try {
      const prog = await PersonalProg.findById(req.params.id);

      if (!prog) {
        return next(createError(404, "Programme not found"));
      }

      const isCoach = prog.coach_id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";

      if (!isCoach && !isAdmin) {
        return next(createError(403, "Only the coach can edit this programme"));
      }

      const fields = ["description", "videos", "image", "rest_days"];
      const updates = {};
      fields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

      const updated = await PersonalProg.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      }).populate([
        { path: "player_id", select: "name email" },
        { path: "coach_id", select: "name email" },
      ]);

      res.status(200).json({ success: true, message: "Programme updated", data: updated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async deleteProg(req, res, next) {
    try {
      const prog = await PersonalProg.findById(req.params.id);

      if (!prog) {
        return next(createError(404, "Programme not found"));
      }

      const isCoach = prog.coach_id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";

      if (!isCoach && !isAdmin) {
        return next(createError(403, "Only the coach can delete this programme"));
      }

      await PersonalProg.findByIdAndDelete(req.params.id);

      res.status(200).json({ success: true, message: "Programme deleted" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

module.exports = new PersonalProgController();