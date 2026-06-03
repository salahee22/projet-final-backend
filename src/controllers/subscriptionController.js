const Subscription = require("../models/Subscription");
const createError = require("../utils/createError");
const { getPagination, getPaginationMeta } = require("../utils/queryHelpers");
 
class SubscriptionController {
  constructor() {
    this.getMySubscription = this.getMySubscription.bind(this);
    this.createSubscription = this.createSubscription.bind(this);
    this.listSubscriptions = this.listSubscriptions.bind(this);
    this.deleteSubscription = this.deleteSubscription.bind(this);
  }
 
  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }
 
  // Joueur : voir son abonnement actif
  async getMySubscription(req, res, next) {
    try {
      const subscription = await Subscription.findOne({
        user_id: req.user._id,
        ends_at: { $gte: new Date() },
      })
        .populate("coach_id", "name email")
        .sort({ starts_at: -1 });
 
      if (!subscription) {
        return res.status(200).json({ success: true, data: null, message: "No active subscription" });
      }
 
      res.status(200).json({ success: true, data: subscription });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  // Admin : voir tous les abonnements
  async listSubscriptions(req, res, next) {
    try {
      const filter = {};
      if (req.query.user_id) filter.user_id = req.query.user_id;
      if (req.query.plan_name) filter.plan_name = req.query.plan_name;
      if (req.query.active === "true") filter.ends_at = { $gte: new Date() };
 
      const { page, limit, skip } = getPagination(req.query);
      const [total, subscriptions] = await Promise.all([
        Subscription.countDocuments(filter),
        Subscription.find(filter)
          .populate("user_id", "name email")
          .populate("coach_id", "name email")
          .sort({ starts_at: -1 })
          .skip(skip)
          .limit(limit),
      ]);
 
      res.status(200).json({
        success: true,
        pagination: getPaginationMeta(total, page, limit, subscriptions.length),
        data: subscriptions,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  // Admin crée un abonnement pour un utilisateur
  async createSubscription(req, res, next) {
    try {
      const { user_id, plan_name, price, starts_at, ends_at, coach_id } = req.body;
 
      const subscription = await Subscription.create({
        user_id,
        plan_name,
        price,
        starts_at,
        ends_at,
        coach_id: coach_id || null,
      });
 
      const populated = await subscription.populate([
        { path: "user_id", select: "name email" },
        { path: "coach_id", select: "name email" },
      ]);
 
      res.status(201).json({
        success: true,
        message: "Subscription created",
        data: populated,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  // Admin supprime un abonnement
  async deleteSubscription(req, res, next) {
    try {
      const subscription = await Subscription.findByIdAndDelete(req.params.id);
 
      if (!subscription) return next(createError(404, "Subscription not found"));
 
      res.status(200).json({ success: true, message: "Subscription deleted" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}
 
module.exports = new SubscriptionController();