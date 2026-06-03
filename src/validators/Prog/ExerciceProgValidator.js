const { body, param } = require("express-validator");
 
const addExerciceValidator = [
  param("progId")
    .isMongoId().withMessage("Programme id must be a valid MongoDB id"),
 
  body("exo_id")
    .notEmpty().withMessage("exo_id is required")
    .isMongoId().withMessage("exo_id must be a valid MongoDB id"),
 
  body("week_num")
    .notEmpty().withMessage("week_num is required")
    .isInt({ min: 1 }).withMessage("week_num must be an integer >= 1"),
 
  body("day_num")
    .notEmpty().withMessage("day_num is required")
    .isInt({ min: 1, max: 7 }).withMessage("day_num must be an integer between 1 and 7"),
];
 
const updateExerciceProgValidator = [
  param("id")
    .isMongoId().withMessage("Entry id must be a valid MongoDB id"),
 
  body("week_num")
    .optional()
    .isInt({ min: 1 }).withMessage("week_num must be an integer >= 1"),
 
  body("day_num")
    .optional()
    .isInt({ min: 1, max: 7 }).withMessage("day_num must be between 1 and 7"),
 
  body("complete")
    .optional()
    .isBoolean().withMessage("complete must be a boolean"),
];
 
const exerciceProgIdValidator = [
  param("id")
    .isMongoId().withMessage("Entry id must be a valid MongoDB id"),
];
 
module.exports = { addExerciceValidator, updateExerciceProgValidator, exerciceProgIdValidator };