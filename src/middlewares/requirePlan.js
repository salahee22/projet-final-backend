const Subscription = require("../models/Subscription");
const createError = require("../utils/createError");

// Hiérarchie des plans : plus l'index est élevé, plus le plan est avancé
const PLAN_LEVELS = { basic: 1, premium: 2, elite: 3 };
const PLAN_LABELS = { basic: "Basic (Elite 1)", premium: "Premium (Elite 2)", elite: "Elite (Elite 3)" };

const requirePlan = (minimumPlan) => {
  const requiredLevel = PLAN_LEVELS[minimumPlan];

  if (!requiredLevel) {
    throw new Error(`requirePlan: plan inconnu "${minimumPlan}". Utilise 'basic', 'premium' ou 'elite'.`);
  }

  return async (req, res, next) => {
    try {
      // Les coachs et admins ne sont jamais soumis à cette restriction
      if (req.user.role === "coach" || req.user.role === "admin") {
        return next();
      }

      const sub = await Subscription.findOne({
        user_id: req.user._id,
        ends_at: { $gte: new Date() },
      });

      if (!sub) {
        return next(createError(403, "A premium subscription is required"));
      }

      const userLevel = PLAN_LEVELS[sub.plan_name] || 0;

      if (userLevel < requiredLevel) {
        return next(createError(403, `Cette fonctionnalité nécessite au minimum l'abonnement ${PLAN_LABELS[minimumPlan]}`));
      }

      req.subscription = sub; // dispo dans le controller si besoin
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = requirePlan;