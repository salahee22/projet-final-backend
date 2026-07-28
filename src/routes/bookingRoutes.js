const express = require("express");
const bookingController = require("../controllers/bookingController");
const verifyToken = require("../middlewares/verifyToken");
const requirePlan = require("../middlewares/requirePlan");

const router = express.Router();

router.use(verifyToken);

router.get("/", bookingController.listMyBookings);
router.post("/book-slot", requirePlan("elite"), bookingController.bookSlot);
router.post("/propose", requirePlan("elite"), bookingController.proposeBooking);
router.put("/:id/status", bookingController.updateStatus); // coach/admin uniquement (vérifié dans le contrôleur)
router.put("/:id/cancel", bookingController.cancelBooking);

module.exports = router;