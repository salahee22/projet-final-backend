const ProfilPlayer = require("../models/ProfilPlayer");
const createError = require("../utils/createError");
 
class ProfilPlayerController {
  constructor() {
    this.getMyProfil = this.getMyProfil.bind(this);
    this.getPlayerProfil = this.getPlayerProfil.bind(this);
    this.createProfil = this.createProfil.bind(this);
    this.updateProfil = this.updateProfil.bind(this);
  }
 
  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }
 
  async getMyProfil(req, res, next) {
    try {
      const profil = await ProfilPlayer.findOne({ user_id: req.user._id }).populate("user_id", "name email role");
 
      if (!profil) {
        return next(createError(404, "Profil not found"));
      }
 
      res.status(200).json({ success: true, data: profil });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  // Admin/coach : consulter le profil d'un joueur précis
  async getPlayerProfil(req, res, next) {
    try {
      const profil = await ProfilPlayer.findOne({ user_id: req.params.userId }).populate("user_id", "name email role");

      if (!profil) {
        return next(createError(404, "Profil not found"));
      }

      res.status(200).json({ success: true, data: profil });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async createProfil(req, res, next) {
    try {
      const existing = await ProfilPlayer.findOne({ user_id: req.user._id });
 
      if (existing) {
        return next(createError(409, "Profil already exists"));
      }
 
      const { birth_day, position, club, phone, height, weight, medical_info, upload_file } = req.body;
 
      const profil = await ProfilPlayer.create({
        user_id: req.user._id,
        birth_day,
        position,
        club,
        phone,
        height,
        weight,
        medical_info,
        upload_file,
      });
 
      const populated = await profil.populate("user_id", "name email role");
 
      res.status(201).json({
        success: true,
        message: "Profil created",
        data: populated,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async updateProfil(req, res, next) {
    try {
      const fields = ["birth_day", "position", "club", "phone", "height", "weight", "medical_info", "upload_file"];
      const updates = {};
      fields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
 
      const profil = await ProfilPlayer.findOneAndUpdate(
        { user_id: req.user._id },
        updates,
        { new: true, runValidators: true }
      ).populate("user_id", "name email role");
 
      if (!profil) {
        return next(createError(404, "Profil not found"));
      }
 
      res.status(200).json({ success: true, message: "Profil updated", data: profil });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}
 
module.exports = new ProfilPlayerController();