const express = require("express");
const sessionFeedbackController = require("../controllers/sessionFeedbackController");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/validate");
const { createFeedbackValidator, progIdParamValidator } = require("../validators/Prog/SessionFeedbackValidator");

const router = express.Router();

router.use(verifyToken);

router.post("/", createFeedbackValidator, validate, sessionFeedbackController.createFeedback);
router.get("/:progId", progIdParamValidator, validate, sessionFeedbackController.listFeedbackForProgram);

module.exports = router;