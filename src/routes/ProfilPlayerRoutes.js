const express = require("express");
const profilPlayerController = require("../controllers/profilPlayerController");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/validate");
const { createProfilValidator, updateProfilValidator } = require("../validators/Prog/ProfilPlayerValidator");
 
const router = express.Router();
 
router.use(verifyToken);
 
router.get("/me", profilPlayerController.getMyProfil);
router.post("/", createProfilValidator, validate, profilPlayerController.createProfil);
router.put("/", updateProfilValidator, validate, profilPlayerController.updateProfil);
 
module.exports = router;