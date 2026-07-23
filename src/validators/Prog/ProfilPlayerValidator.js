const { body } = require("express-validator");
 
const createProfilValidator = [
  body("birth_day")
    .optional({ nullable: true })
    .isISO8601().withMessage("birth_day must be a valid date"),
 
  body("position")
    .optional({ nullable: true })
    .trim()
    .isString().withMessage("position must be a string"),
 
  body("club")
    .optional({ nullable: true })
    .trim()
    .isString().withMessage("club must be a string"),

  body("phone")
    .optional({ nullable: true })
    .isString().withMessage("phone must be a string"),
 
  body("height")
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage("height must be a positive number"),
 
  body("weight")
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage("weight must be a positive number"),
 
  body("medical_info")
    .optional({ nullable: true })
    .isString().withMessage("medical_info must be a string"),
 
  body("upload_file")
    .optional({ nullable: true })
    .isURL().withMessage("upload_file must be a valid URL"),
];
 
const updateProfilValidator = [...createProfilValidator];
 
module.exports = { createProfilValidator, updateProfilValidator };