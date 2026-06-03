const PerformanceRecord = require("../models/PerformanceRecord");
const createError = require("../utils/createError");
const { getPagination, getPaginationMeta } = require("../utils/queryHelpers");
 
class PerformanceRecordController {
  constructor() {
    this.listRecords = this.listRecords.bind(this);
    this.getRecord = this.getRecord.bind(this);
    this.createRecord = this.createRecord.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);
  }
 
  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }
 
  async listRecords(req, res, next) {
    try {
      // Admin/coach peut voir n'importe quel joueur, sinon seulement soi-même
      const isCoachOrAdmin = req.user.role === "coach" || req.user.role === "admin";
      const targetPlayer = (isCoachOrAdmin && req.query.player_id)
        ? req.query.player_id
        : req.user._id;
 
      const filter = { player_id: targetPlayer };
 
      // Filtre optionnel par date
      if (req.query.from) filter.record_date = { $gte: new Date(req.query.from) };
      if (req.query.to) {
        filter.record_date = { ...filter.record_date, $lte: new Date(req.query.to) };
      }
 
      const { page, limit, skip } = getPagination(req.query);
      const [total, records] = await Promise.all([
        PerformanceRecord.countDocuments(filter),
        PerformanceRecord.find(filter)
          .sort({ record_date: -1 })
          .skip(skip)
          .limit(limit),
      ]);
 
      res.status(200).json({
        success: true,
        pagination: getPaginationMeta(total, page, limit, records.length),
        data: records,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async getRecord(req, res, next) {
    try {
      const record = await PerformanceRecord.findById(req.params.id);
 
      if (!record) return next(createError(404, "Record not found"));
 
      const isOwner = record.player_id.toString() === req.user._id.toString();
      const isCoachOrAdmin = req.user.role === "coach" || req.user.role === "admin";
 
      if (!isOwner && !isCoachOrAdmin) return next(createError(403, "Forbidden"));
 
      res.status(200).json({ success: true, data: record });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async createRecord(req, res, next) {
    try {
      const { record_date, notes, value, unite, image } = req.body;
 
      const record = await PerformanceRecord.create({
        player_id: req.user._id,
        record_date,
        notes,
        value,
        unite,
        image,
      });
 
      res.status(201).json({
        success: true,
        message: "Record created",
        data: record,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async updateRecord(req, res, next) {
    try {
      const record = await PerformanceRecord.findById(req.params.id);
      if (!record) return next(createError(404, "Record not found"));
 
      const isOwner = record.player_id.toString() === req.user._id.toString();
      if (!isOwner && req.user.role !== "admin") return next(createError(403, "Forbidden"));
 
      const fields = ["record_date", "notes", "value", "unite", "image"];
      const updates = {};
      fields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
 
      const updated = await PerformanceRecord.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });
 
      res.status(200).json({ success: true, message: "Record updated", data: updated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async deleteRecord(req, res, next) {
    try {
      const record = await PerformanceRecord.findById(req.params.id);
      if (!record) return next(createError(404, "Record not found"));
 
      const isOwner = record.player_id.toString() === req.user._id.toString();
      if (!isOwner && req.user.role !== "admin") return next(createError(403, "Forbidden"));
 
      await PerformanceRecord.findByIdAndDelete(req.params.id);
 
      res.status(200).json({ success: true, message: "Record deleted" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}
 
module.exports = new PerformanceRecordController();