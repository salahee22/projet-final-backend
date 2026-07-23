const express = require("express");
const profilPlayerController = require("../controllers/profilPlayerController");
const requireSubscription = require("../middlewares/requireSubscription")
const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/authorizeRoles");
const validate = require("../middlewares/validate");
const { createProfilValidator, updateProfilValidator } = require("../validators/Prog/ProfilPlayerValidator");
 
const router = express.Router();

// Admin/coach : consulter le profil d'un joueur précis
router.get("/player/:userId", verifyToken, authorizeRoles("admin", "coach"), profilPlayerController.getPlayerProfil);
 
router.use(verifyToken);
router.use(requireSubscription);
 
router.get("/me", profilPlayerController.getMyProfil);
router.post("/", createProfilValidator, validate, profilPlayerController.createProfil);
router.put("/", updateProfilValidator, validate, profilPlayerController.updateProfil);
 
module.exports = router;