// validators/Saved/savedValidator.js
const { body, param } = require("express-validator");

const createSavedValidator = [
  body("content_id")
    .notEmpty()
    .withMessage("Content id is required")
    .isMongoId()
    .withMessage("Content id must be valid"),

  body("content_type")
    .notEmpty()
    .withMessage("Content type is required"),
];

const deleteSavedValidator = [
  param("contentId")
    .isMongoId()
    .withMessage("Content id must be valid"),
];

module.exports = {
  createSavedValidator,
  deleteSavedValidator,
};
