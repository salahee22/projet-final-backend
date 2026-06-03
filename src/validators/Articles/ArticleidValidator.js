const { param } = require("express-validator");
 
module.exports = [
  param("id")
    .isMongoId()
    .withMessage("Article id must be a valid MongoDB id"),
];
 