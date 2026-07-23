const express = require("express");
const personalProgController = require("../controllers/personalProgController");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/validate");
const requireSubscription = require("../middlewares/requireSubscription");
const { createProgValidator, updateProgValidator, progIdValidator } = require("../validators/Prog/PersonalprogValidator");
 
const router = express.Router();
 
router.use(verifyToken);
router.use(requireSubscription);          



  

 
router.get("/", personalProgController.listMyProgs);
router.get("/:id", progIdValidator, validate, personalProgController.getProg);
router.post("/", createProgValidator, validate, personalProgController.createProg);
router.put("/:id", updateProgValidator, validate, personalProgController.updateProg);
router.delete("/:id", progIdValidator, validate, personalProgController.deleteProg);
 
module.exports = router;