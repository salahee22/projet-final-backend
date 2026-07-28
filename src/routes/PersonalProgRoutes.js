const express = require("express");
const personalProgController = require("../controllers/personalProgController");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/validate");
const requirePlan = require("../middlewares/requirePlan");
const { createProgValidator, updateProgValidator, progIdValidator } = require("../validators/Prog/PersonalprogValidator");
 
const router = express.Router();
 
router.use(verifyToken);
router.use(requirePlan("basic"));

router.get("/", personalProgController.listMyProgs);
router.get("/:id", progIdValidator, validate, personalProgController.getProg);
router.post("/", createProgValidator, validate, personalProgController.createProg);
router.put("/:id", updateProgValidator, validate, personalProgController.updateProg);
router.delete("/:id", progIdValidator, validate, personalProgController.deleteProg);
 
module.exports = router;