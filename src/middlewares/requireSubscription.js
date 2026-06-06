// middlewares/requireSubscription.js
const Subscription = require("../models/Subscription");
const createError = require("../utils/createError");

const requireSubscription = async (req, res, next) => {
  const sub = await Subscription.findOne({
    user_id: req.user._id,
    ends_at: { $gte: new Date() },
  });

  if (!sub) {
    return next(createError(403, "A premium subscription is required"));
  }

  next();
};

module.exports = requireSubscription;