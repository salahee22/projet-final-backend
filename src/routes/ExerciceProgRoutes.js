const express = require("express");
const exerciceProgController = require("../controllers/exerciceProgController");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/validate");
const { addExerciceValidator, updateExerciceProgValidator, exerciceProgIdValidator } = require("../validators/Prog/ExerciceProgValidator");
 
const router = express.Router();
 
router.use(verifyToken);
 
router.get("/:progId", exerciceProgController.listExercicesOfProg);
router.post("/:progId", addExerciceValidator, validate, exerciceProgController.addExerciceToProg);
router.put("/:id", updateExerciceProgValidator, validate, exerciceProgController.updateExerciceProg);
router.delete("/:id", exerciceProgIdValidator, validate, exerciceProgController.removeExerciceFromProg);
 
module.exports = router;