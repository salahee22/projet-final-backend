const express = require("express");
const articleController = require("../controllers/articleController");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/validate");
const articleIdValidator = require("../validators/Articles/articleIdValidator");
const createArticleValidator = require("../validators/Articles/createArticleValidator");
const updateArticleValidator = require("../validators/Articles/updateArticleValidator");
 
const router = express.Router();
 
router.get("/", articleController.listArticles);
router.get("/:id", articleIdValidator, validate, articleController.getArticle);
 
router.use(verifyToken);
 
router.post("/", createArticleValidator, validate, articleController.createArticle);
router.put("/:id", updateArticleValidator, validate, articleController.updateArticle);
router.delete("/:id", articleIdValidator, validate, articleController.deleteArticle);
 
module.exports = router;