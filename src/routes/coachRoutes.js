const express = require("express");
const coachController = require("../controllers/coachController");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/validate");
const { createCoachValidator, updateCoachValidator, coachIdValidator } = require("../validators/Coach/coachValidator");

const router = express.Router();

router.get("/", coachController.listCoaches);
router.get("/:id", coachIdValidator, validate, coachController.getCoach);

router.use(verifyToken);

router.post("/", createCoachValidator, validate, coachController.createCoach);
router.put("/:id", updateCoachValidator, validate, coachController.updateCoach);
router.delete("/:id", coachIdValidator, validate, coachController.deleteCoach);

module.exports = router;