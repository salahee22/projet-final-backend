const express = require("express");
const exerciceController = require("../controllers/exerciceController");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/validate");
const exerciceIdValidator = require("../validators/Exercices/exerciceIdValidator");
const createExerciceValidator = require("../validators/Exercices/createExerciceValidator");
const updateExerciceValidator = require("../validators/Exercices/updateExerciceValidator");
 
const router = express.Router();
 
router.get("/", exerciceController.listExercices);
router.get("/:id", exerciceIdValidator, validate, exerciceController.getExercice);
 
router.use(verifyToken);
 
router.post("/", createExerciceValidator, validate, exerciceController.createExercice);
router.put("/:id", updateExerciceValidator, validate, exerciceController.updateExercice);
router.delete("/:id", exerciceIdValidator, validate, exerciceController.deleteExercice);
 
module.exports = router;