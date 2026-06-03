const { body, param } = require("express-validator");
 
const createSubscriptionValidator = [
  body("user_id")
    .notEmpty().withMessage("user_id is required")
    .isMongoId().withMessage("user_id must be a valid MongoDB id"),
 
  body("plan_name")
    .notEmpty().withMessage("plan_name is required")
    .isIn(["basic", "premium", "elite"]).withMessage("plan_name must be one of: basic, premium, elite"),
 
  body("price")
    .notEmpty().withMessage("price is required")
    .isFloat({ min: 0 }).withMessage("price must be a positive number"),
 
  body("ends_at")
    .notEmpty().withMessage("ends_at is required")
    .isISO8601().withMessage("ends_at must be a valid date (ISO 8601)"),
 
  body("starts_at")
    .optional()
    .isISO8601().withMessage("starts_at must be a valid date"),
 
  body("coach_id")
    .optional({ nullable: true })
    .isMongoId().withMessage("coach_id must be a valid MongoDB id"),
];
 
const subscriptionIdValidator = [
  param("id")
    .isMongoId().withMessage("Subscription id must be a valid MongoDB id"),
];
 
module.exports = { createSubscriptionValidator, subscriptionIdValidator };