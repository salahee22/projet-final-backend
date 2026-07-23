const { body, param } = require("express-validator");

const createFeedbackValidator = [
  body("program_id").isMongoId().withMessage("program_id must be a valid MongoDB id"),
  body("week_num").isInt({ min: 1 }).withMessage("week_num must be an integer >= 1"),
  body("day_num").isInt({ min: 1, max: 7 }).withMessage("day_num must be between 1 and 7"),
  body("feeling").isIn(["fatigue", "moyen", "en_forme"]).withMessage("Invalid feeling"),
  body("load_preference").optional().isIn(["baisser", "garder", "augmenter"]),
  body("comment").optional({ nullable: true }).isString(),
];

const progIdParamValidator = [
  param("progId").isMongoId().withMessage("progId must be a valid MongoDB id"),
];

module.exports = { createFeedbackValidator, progIdParamValidator };