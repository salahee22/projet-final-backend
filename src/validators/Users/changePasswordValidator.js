const { body } = require("express-validator");

module.exports = [
  body("current_password")
    .notEmpty().withMessage("Current password is required"),

  body("new_password")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 6 }).withMessage("New password must be at least 6 characters")
    .custom((value, { req }) => {
      if (value === req.body.current_password) {
        throw new Error("New password must be different from current password");
      }
      return true;
    }),
];