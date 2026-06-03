const express = require("express");
const subscriptionController = require("../controllers/subscriptionController");
const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/authorizeRoles");
const validate = require("../middlewares/validate");
const { createSubscriptionValidator, subscriptionIdValidator } = require("../validators/Prog/SubscriptionValidator");
 
const router = express.Router();
 
router.use(verifyToken);
 
// Joueur : voir son abonnement actif
router.get("/me", subscriptionController.getMySubscription);
 
// Admin seulement
router.get("/", authorizeRoles("admin"), subscriptionController.listSubscriptions);
router.post("/", authorizeRoles("admin"), createSubscriptionValidator, validate, subscriptionController.createSubscription);
router.delete("/:id", authorizeRoles("admin"), subscriptionIdValidator, validate, subscriptionController.deleteSubscription);
 
module.exports = router;