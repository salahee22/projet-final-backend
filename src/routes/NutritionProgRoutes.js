const express = require("express");
const nutritionProgController = require("../controllers/nutritionProgController");
const verifyToken = require("../middlewares/verifyToken");
const requireSubscription = require("../middlewares/requireSubscription");
const validate = require("../middlewares/validate");
const { addNutritionValidator, updateNutritionValidator, nutritionIdValidator } = require("../validators/Prog/NutritionProgValidator");

const router = express.Router();

router.use(verifyToken);
router.use(requireSubscription);

router.get("/:progId", nutritionProgController.listNutritionOfProg);
router.post("/:progId", addNutritionValidator, validate, nutritionProgController.addNutritionToProg);
router.put("/:id", updateNutritionValidator, validate, nutritionProgController.updateNutritionProg);
router.delete("/:id", nutritionIdValidator, validate, nutritionProgController.removeNutritionFromProg);

module.exports = router;