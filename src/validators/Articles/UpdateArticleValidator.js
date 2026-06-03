const { body, param } = require("express-validator");
 
module.exports = [
  param("id")
    .isMongoId().withMessage("Article id must be a valid MongoDB id"),
 
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage("Title must be between 3 and 200 characters"),
 
  body("content")
    .optional()
    .trim()
    .notEmpty().withMessage("Content cannot be empty"),
 
  body("category")
    .optional()
    .isIn(["fundamentals", "training", "tactics", "goalkeeping", "news", "other"])
    .withMessage("Category must be one of: fundamentals, training, tactics, goalkeeping, news, other"),
 
  body("img")
    .optional({ nullable: true })
    .isURL().withMessage("img must be a valid URL"),
 
  body("video")
    .optional({ nullable: true })
    .isURL().withMessage("video must be a valid URL"),
];