const { body, param } = require("express-validator");

const createApplicationValidator = [
  body("nom").trim().notEmpty().withMessage("Nom is required"),
  body("prenom").trim().notEmpty().withMessage("Prenom is required"),
  body("age").notEmpty().withMessage("Age is required").isInt({ min: 5, max: 60 }).withMessage("Age must be a valid number"),
  body("poste").trim().notEmpty().withMessage("Poste is required"),
  body("niveau").trim().notEmpty().withMessage("Niveau is required"),
  body("club").optional({ nullable: true }).isString(),
  body("telephone").trim().notEmpty().withMessage("Telephone is required"),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("message").optional({ nullable: true }).isString(),
  body("offre").notEmpty().isIn(["elite1", "elite2", "elite3"]).withMessage("Invalid offre"),
];

const updateStatusValidator = [
  param("id").isMongoId().withMessage("Application id must be a valid MongoDB id"),
  body("status").notEmpty().isIn(["nouvelle", "contactee", "acceptee", "refusee"]).withMessage("Invalid status"),
];

const applicationIdValidator = [
  param("id").isMongoId().withMessage("Application id must be a valid MongoDB id"),
];

module.exports = { createApplicationValidator, updateStatusValidator, applicationIdValidator };