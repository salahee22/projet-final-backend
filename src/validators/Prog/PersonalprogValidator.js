const { body, param } = require("express-validator");
 
const createProgValidator = [
  body("player_id")
    .notEmpty().withMessage("player_id is required")
    .isMongoId().withMessage("player_id must be a valid MongoDB id"),
 
  body("description")
    .optional({ nullable: true })
    .isString().withMessage("description must be a string"),
 
  body("videos")
    .optional({ nullable: true })
    .isURL().withMessage("videos must be a valid URL"),
 
  body("image")
    .optional({ nullable: true })
    .isURL().withMessage("image must be a valid URL"),
];
 
const updateProgValidator = [
  param("id")
    .isMongoId().withMessage("Programme id must be a valid MongoDB id"),
 
  body("description")
    .optional({ nullable: true })
    .isString().withMessage("description must be a string"),
 
  body("videos")
    .optional({ nullable: true })
    .isURL().withMessage("videos must be a valid URL"),
 
  body("image")
    .optional({ nullable: true })
    .isURL().withMessage("image must be a valid URL"),
];
 
const progIdValidator = [
  param("id")
    .isMongoId().withMessage("Programme id must be a valid MongoDB id"),
];
 
module.exports = { createProgValidator, updateProgValidator, progIdValidator };