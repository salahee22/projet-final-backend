const express = require("express");
const availabilitySlotController = require("../controllers/availabilitySlotController");
const verifyToken = require("../middlewares/verifyToken");
const requirePlan = require("../middlewares/requirePlan");

const router = express.Router();

router.use(verifyToken);

router.get("/open", requirePlan("elite"), availabilitySlotController.listOpenSlots); // joueur elite
router.post("/", availabilitySlotController.createSlot); // coach/admin
router.get("/", availabilitySlotController.listSlots); // coach/admin
router.delete("/:id", availabilitySlotController.deleteSlot);

module.exports = router;