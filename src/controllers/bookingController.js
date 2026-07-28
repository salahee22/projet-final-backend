const Booking = require("../models/Booking");
const AvailabilitySlot = require("../models/AvailabilitySlot");
const createError = require("../utils/createError");

class BookingController {
  constructor() {
    this.bookSlot = this.bookSlot.bind(this);
    this.proposeBooking = this.proposeBooking.bind(this);
    this.listMyBookings = this.listMyBookings.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.cancelBooking = this.cancelBooking.bind(this);
  }

  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }

  // Joueur réserve un créneau déjà proposé par le coach -> confirmé directement
  async bookSlot(req, res, next) {
    try {
      const { slot_id } = req.body;

      if (!slot_id) {
        return next(createError(400, "slot_id is required"));
      }

      const slot = await AvailabilitySlot.findById(slot_id);

      if (!slot) {
        return next(createError(404, "Slot not found"));
      }

      if (slot.is_booked) {
        return next(createError(400, "Ce créneau n'est plus disponible"));
      }

      const booking = await Booking.create({
        player_id: req.user._id,
        coach_id: slot.coach_id,
        slot_id: slot._id,
        date: slot.date,
        time: slot.time,
        location: slot.location,
        status: "confirmed",
      });

      slot.is_booked = true;
      await slot.save();

      const populated = await booking.populate([
        { path: "player_id", select: "name email" },
        { path: "coach_id", select: "name email" },
      ]);

      res.status(201).json({ success: true, message: "Réservation confirmée", data: populated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  // Joueur propose une date/heure/lieu hors créneaux -> en attente de validation
  async proposeBooking(req, res, next) {
    try {
      const { coach_id, date, time, location } = req.body;

      if (!coach_id || !date || !time || !location) {
        return next(createError(400, "coach_id, date, time and location are required"));
      }

      const booking = await Booking.create({
        player_id: req.user._id,
        coach_id,
        date,
        time,
        location,
        status: "pending",
      });

      const populated = await booking.populate([
        { path: "player_id", select: "name email" },
        { path: "coach_id", select: "name email" },
      ]);

      res.status(201).json({ success: true, message: "Demande envoyée", data: populated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  // Joueur voit ses réservations, coach/admin voit toutes celles qui le concernent
  async listMyBookings(req, res, next) {
    try {
      const isCoach = req.user.role === "coach" || req.user.role === "admin";
      const filter = isCoach ? {} : { player_id: req.user._id };

      const bookings = await Booking.find(filter)
        .populate("player_id", "name email")
        .populate("coach_id", "name email")
        .sort({ date: 1, time: 1 });

      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  // Coach/admin confirme ou refuse une demande en attente
  async updateStatus(req, res, next) {
    try {
      const isCoach = req.user.role === "coach" || req.user.role === "admin";
      if (!isCoach) {
        return next(createError(403, "Only coaches can update booking status"));
      }

      const { status } = req.body;

      if (!["confirmed", "rejected"].includes(status)) {
        return next(createError(400, "status must be 'confirmed' or 'rejected'"));
      }

      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return next(createError(404, "Booking not found"));
      }

      booking.status = status;
      await booking.save();

      const populated = await booking.populate([
        { path: "player_id", select: "name email" },
        { path: "coach_id", select: "name email" },
      ]);

      res.status(200).json({ success: true, data: populated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  // Le joueur ou le coach/admin annule une réservation
  async cancelBooking(req, res, next) {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return next(createError(404, "Booking not found"));
      }

      const isPlayer = booking.player_id.toString() === req.user._id.toString();
      const isCoach = req.user.role === "coach" || req.user.role === "admin";

      if (!isPlayer && !isCoach) {
        return next(createError(403, "Forbidden"));
      }

      booking.status = "cancelled";
      await booking.save();

      if (booking.slot_id) {
        await AvailabilitySlot.findByIdAndUpdate(booking.slot_id, { is_booked: false });
      }

      res.status(200).json({ success: true, message: "Réservation annulée", data: booking });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

module.exports = new BookingController();