const { body } = require("express-validator");
 
module.exports = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 200 }).withMessage("Title must be between 3 and 200 characters"),
 
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required"),
 
  body("category")
    .optional()
    .isIn(["basic", "development", "elite", "physical", "technical", "tactical", "goalkeeping"])
    .withMessage("Invalid category"),
 
  body("level")
    .optional()
    .isIn(["U6-U12", "U12-U17", "senior", "elite"])
    .withMessage("Level must be one of: U6-U12, U12-U17, senior, elite"),
 
  body("is_goalkeeper")
    .optional()
    .isBoolean().withMessage("is_goalkeeper must be a boolean"),
 
  body("equipements")
    .optional({ nullable: true })
    .isString().withMessage("equipements must be a string"),
 
  body("img")
    .optional({ nullable: true })
    .isURL().withMessage("img must be a valid URL"),
 
  body("video")
    .optional({ nullable: true })
    .isURL().withMessage("video must be a valid URL"),
];