const { body, param } = require("express-validator");

const MEAL_TYPES = ["petit_dejeuner", "collation_matin", "dejeuner", "collation_apres_midi", "diner"];

const addNutritionValidator = [
  param("progId")
    .isMongoId().withMessage("Programme id must be a valid MongoDB id"),

  body("meal_type")
    .notEmpty().withMessage("meal_type is required")
    .isIn(MEAL_TYPES).withMessage("Invalid meal_type"),

  body("content")
    .trim()
    .notEmpty().withMessage("content is required"),

  body("week_num")
    .notEmpty().withMessage("week_num is required")
    .isInt({ min: 1 }).withMessage("week_num must be an integer >= 1"),

  body("day_num")
    .notEmpty().withMessage("day_num is required")
    .isInt({ min: 1, max: 7 }).withMessage("day_num must be an integer between 1 and 7"),
];

const updateNutritionValidator = [
  param("id").isMongoId().withMessage("Entry id must be a valid MongoDB id"),
  body("meal_type").optional().isIn(MEAL_TYPES).withMessage("Invalid meal_type"),
  body("content").optional().trim().notEmpty().withMessage("content cannot be empty"),
  body("week_num").optional().isInt({ min: 1 }),
  body("day_num").optional().isInt({ min: 1, max: 7 }),
];

const nutritionIdValidator = [
  param("id").isMongoId().withMessage("Entry id must be a valid MongoDB id"),
];

module.exports = { addNutritionValidator, updateNutritionValidator, nutritionIdValidator };