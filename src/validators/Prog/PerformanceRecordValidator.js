const { body, param } = require("express-validator");
 
const createRecordValidator = [
  body("value")
    .notEmpty().withMessage("value is required")
    .isNumeric().withMessage("value must be a number"),
 
  body("unite")
    .trim()
    .notEmpty().withMessage("unite is required")
    .isString().withMessage("unite must be a string"),
 
  body("record_date")
    .optional()
    .isISO8601().withMessage("record_date must be a valid date (ISO 8601)"),
 
  body("notes")
    .optional({ nullable: true })
    .isString().withMessage("notes must be a string"),
 
  body("image")
    .optional({ nullable: true })
    .isURL().withMessage("image must be a valid URL"),
];
 
const updateRecordValidator = [
  param("id")
    .isMongoId().withMessage("Record id must be a valid MongoDB id"),
 
  body("value")
    .optional()
    .isNumeric().withMessage("value must be a number"),
 
  body("unite")
    .optional()
    .trim()
    .notEmpty().withMessage("unite cannot be empty"),
 
  body("record_date")
    .optional()
    .isISO8601().withMessage("record_date must be a valid date"),
 
  body("notes")
    .optional({ nullable: true })
    .isString(),
 
  body("image")
    .optional({ nullable: true })
    .isURL().withMessage("image must be a valid URL"),
];
 
const recordIdValidator = [
  param("id")
    .isMongoId().withMessage("Record id must be a valid MongoDB id"),
];
 
module.exports = { createRecordValidator, updateRecordValidator, recordIdValidator };