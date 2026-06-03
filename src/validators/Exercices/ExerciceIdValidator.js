const { param } = require("express-validator");
 
module.exports = [
  param("id")
    .isMongoId()
    .withMessage("Exercice id must be a valid MongoDB id"),
];