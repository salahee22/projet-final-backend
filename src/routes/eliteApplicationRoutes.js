const express = require("express");
const eliteApplicationController = require("../controllers/eliteApplicationController");
const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/authorizeRoles");
const validate = require("../middlewares/validate");
const {
  createApplicationValidator,
  updateStatusValidator,
  applicationIdValidator,
} = require("../validators/EliteApplication/eliteApplicationValidator");

const router = express.Router();

// Webhook Chargily — public, doit être AVANT tout middleware d'auth
router.post("/webhook", eliteApplicationController.handleWebhook);

router.post("/", createApplicationValidator, validate, eliteApplicationController.createApplication);

router.use(verifyToken);
router.use(authorizeRoles("admin", "coach"));

router.get("/", eliteApplicationController.listApplications);
router.put("/:id/status", updateStatusValidator, validate, eliteApplicationController.updateStatus);
router.put("/:id/accept", applicationIdValidator, validate, eliteApplicationController.acceptApplication);
router.delete("/:id", applicationIdValidator, validate, eliteApplicationController.deleteApplication);

module.exports = router;