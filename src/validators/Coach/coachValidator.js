const { body, param } = require("express-validator");

const createCoachValidator = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("role").trim().notEmpty().withMessage("Role is required"),
  body("specialite").trim().notEmpty().withMessage("Specialite is required"),
  body("experience").optional({ nullable: true }).isString(),
  body("diplomes").optional({ nullable: true }).isString(),
  body("image").optional({ nullable: true }).isURL().withMessage("image must be a valid URL"),
  body("color").optional().isString(),
  body("order").optional().isInt().withMessage("order must be an integer"),
];

const updateCoachValidator = [
  param("id").isMongoId().withMessage("Coach id must be a valid MongoDB id"),
  body("name").optional().trim().isLength({ max: 100 }),
  body("role").optional().trim().notEmpty(),
  body("specialite").optional().trim().notEmpty(),
  body("experience").optional({ nullable: true }).isString(),
  body("diplomes").optional({ nullable: true }).isString(),
  body("image").optional({ nullable: true }).isURL(),
  body("color").optional().isString(),
  body("order").optional().isInt(),
];

const coachIdValidator = [
  param("id").isMongoId().withMessage("Coach id must be a valid MongoDB id"),
];

module.exports = { createCoachValidator, updateCoachValidator, coachIdValidator };