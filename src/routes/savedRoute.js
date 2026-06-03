const express = require("express");
const savedController = require("../controllers/savedController");
const validate = require("../middlewares/validate");
const verifyToken = require("../middlewares/verifyToken");
const savedValidator = require("../validators/Saved/savedValidator");

const router = express.Router();

router.use(verifyToken);

router.get("/", savedController.listSaved);
router.post("/", savedValidator.createSavedValidator, validate, savedController.addSaved);
router.delete("/:contentId",
savedValidator.deleteSavedValidator,validate,savedController.removeSaved);

module.exports = router;
