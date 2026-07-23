const { body } = require("express-validator");

module.exports = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 200 }).withMessage("Title must be between 3 and 200 characters"),

  body("summary")
    .trim()
    .notEmpty().withMessage("Summary is required")
    .isLength({ max: 300 }).withMessage("Summary must be under 300 characters"),

  body("content")
    .trim()
    .notEmpty().withMessage("Content is required"),

  body("category")
    .optional()
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

  body("read_time").optional().isString(),
  body("tag").optional({ nullable: true }).isString(),

  // Contenu long — validation légère, la structure fine est vérifiée par Mongoose
  body("intro").optional().isObject().withMessage("intro must be an object"),
  body("intro.paragraphs").optional().isArray().withMessage("intro.paragraphs must be an array"),

  body("chapters").optional().isArray().withMessage("chapters must be an array"),
  body("chapters.*.title").optional().isString().withMessage("each chapter needs a title"),

  body("conclusion").optional().isObject().withMessage("conclusion must be an object"),
  body("sidebar").optional().isObject().withMessage("sidebar must be an object"),
];