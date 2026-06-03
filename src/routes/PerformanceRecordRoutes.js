const express = require("express");
const performanceRecordController = require("../controllers/performanceRecordController");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/validate");
const { createRecordValidator, updateRecordValidator, recordIdValidator } = require("../validators/Prog/PerformanceRecordValidator");
 
const router = express.Router();
 
router.use(verifyToken);
 
router.get("/", performanceRecordController.listRecords);
router.get("/:id", recordIdValidator, validate, performanceRecordController.getRecord);
router.post("/", createRecordValidator, validate, performanceRecordController.createRecord);
router.put("/:id", updateRecordValidator, validate, performanceRecordController.updateRecord);
router.delete("/:id", recordIdValidator, validate, performanceRecordController.deleteRecord);
 
module.exports = router;