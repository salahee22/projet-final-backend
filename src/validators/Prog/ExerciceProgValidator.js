const { body, param } = require("express-validator");
 
const addExerciceValidator = [
  param("progId")
    .isMongoId().withMessage("Programme id must be a valid MongoDB id"),
 
  body("name")
    .trim()
    .notEmpty().withMessage("name is required")
    .isLength({ max: 200 }).withMessage("name is too long"),
 
  body("sets")
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage("sets must be a positive integer"),
 
  body("reps")
    .optional({ nullable: true })
    .isString().withMessage("reps must be a string"),
 
  body("rest")
    .optional({ nullable: true })
    .isString().withMessage("rest must be a string"),
 
  body("notes")
    .optional({ nullable: true })
    .isString().withMessage("notes must be a string"),
 
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
 
  body("name").optional().trim().isLength({ max: 200 }),
  body("sets").optional({ nullable: true }).isInt({ min: 0 }),
  body("reps").optional({ nullable: true }).isString(),
  body("rest").optional({ nullable: true }).isString(),
  body("notes").optional({ nullable: true }).isString(),
 
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