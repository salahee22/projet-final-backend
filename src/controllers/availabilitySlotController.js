const AvailabilitySlot = require("../models/AvailabilitySlot");
const createError = require("../utils/createError");

class AvailabilitySlotController {
  constructor() {
    this.createSlot = this.createSlot.bind(this);
    this.listSlots = this.listSlots.bind(this);
    this.listOpenSlots = this.listOpenSlots.bind(this);
    this.deleteSlot = this.deleteSlot.bind(this);
  }

  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }

  // Coach/admin crée un créneau disponible
  async createSlot(req, res, next) {
    try {
      const isCoach = req.user.role === "coach" || req.user.role === "admin";
      if (!isCoach) {
        return next(createError(403, "Only coaches can create slots"));
      }

      const { date, time, location } = req.body;

      if (!date || !time || !location) {
        return next(createError(400, "date, time and location are required"));
      }

      const slot = await AvailabilitySlot.create({
        coach_id: req.user._id,
        date,
        time,
        location,
      });

      res.status(201).json({ success: true, data: slot });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  // Coach/admin voit tous les créneaux (libres + réservés)
  async listSlots(req, res, next) {
    try {
      const isCoach = req.user.role === "coach" || req.user.role === "admin";
      if (!isCoach) {
        return next(createError(403, "Forbidden"));
      }

      const slots = await AvailabilitySlot.find({})
        .populate("coach_id", "name email")
        .sort({ date: 1, time: 1 });

      res.status(200).json({ success: true, data: slots });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  // Joueur voit uniquement les créneaux libres, à venir
  async listOpenSlots(req, res, next) {
    try {
      const slots = await AvailabilitySlot.find({
        is_booked: false,
        date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      })
        .populate("coach_id", "name email")
        .sort({ date: 1, time: 1 });

      res.status(200).json({ success: true, data: slots });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async deleteSlot(req, res, next) {
    try {
      const slot = await AvailabilitySlot.findById(req.params.id);

      if (!slot) {
        return next(createError(404, "Slot not found"));
      }

      const isOwner = slot.coach_id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return next(createError(403, "Forbidden"));
      }

      if (slot.is_booked) {
        return next(createError(400, "Cannot delete a booked slot"));
      }

      await AvailabilitySlot.findByIdAndDelete(req.params.id);

      res.status(200).json({ success: true, message: "Slot deleted" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

module.exports = new AvailabilitySlotController();