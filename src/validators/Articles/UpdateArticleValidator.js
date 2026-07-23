const { body, param } = require("express-validator");
 
module.exports = [
  param("id").isMongoId().withMessage("Article id must be a valid MongoDB id"),
 
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage("Title must be between 3 and 200 characters"),
 
  body("summary")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Summary must be under 300 characters"),
 
  body("content")
    .optional()
    .trim()
    .notEmpty().withMessage("Content cannot be empty"),
 
  body("category")
    .optional({ checkFalsy: true })
    .isIn(["Technique", "Tactique", "Physique", "Mental", "Nutrition"])
    .withMessage("Invalid category"),
 
  body("age")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(["U7", "U9", "U11", "U13", "U15", "U17", "Senior"])
    .withMessage("Invalid age"),
 
  body("image")
    .optional({ nullable: true, checkFalsy: true })
    .isURL().withMessage("image must be a valid URL"),
 
  body("images")
    .optional()
    .isArray().withMessage("images must be an array"),
 
  body("images.*")
    .optional({ checkFalsy: true })
    .isURL().withMessage("each image must be a valid URL"),
 
  body("video")
    .optional({ nullable: true, checkFalsy: true })
    .isURL().withMessage("video must be a valid URL"),
 
  body("read_time").optional().isString().withMessage("read_time must be a string"),
  body("tag").optional({ nullable: true, checkFalsy: true }).isString().withMessage("tag must be a string"),
 
  body("intro").optional().isObject().withMessage("intro must be an object"),
  body("chapters").optional().isArray().withMessage("chapters must be an array"),
  body("conclusion").optional().isObject().withMessage("conclusion must be an object"),
  body("sidebar").optional().isObject().withMessage("sidebar must be an object"),
];
 