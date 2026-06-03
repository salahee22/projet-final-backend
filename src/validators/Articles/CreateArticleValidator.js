const { body } = require("express-validator");
 
module.exports = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 200 }).withMessage("Title must be between 3 and 200 characters"),
 
  body("content")
    .trim()
    .notEmpty().withMessage("Content is required"),
 
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