const Article = require("../models/Articles");
const createError = require("../utils/createError");
const { escapeRegex, getPagination, getPaginationMeta } = require("../utils/queryHelpers");
 
class ArticleController {
  constructor() {
    this.listArticles = this.listArticles.bind(this);
    this.getArticle = this.getArticle.bind(this);
    this.createArticle = this.createArticle.bind(this);
    this.updateArticle = this.updateArticle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
  }
 
  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }
 
  async listArticles(req, res, next) {
    try {
      const filter = {};
      const search = req.query.search || req.query.q;
 
      if (search) {
        filter.$or = [
          { title: new RegExp(escapeRegex(String(search).trim()), "i") },
          { content: new RegExp(escapeRegex(String(search).trim()), "i") },
        ];
      }
 
      if (req.query.category) {
        filter.category = req.query.category;
      }
 
      const { page, limit, skip } = getPagination(req.query);
      const [total, articles] = await Promise.all([
        Article.countDocuments(filter),
        Article.find(filter)
          .populate("author_id", "name role")
          .sort({ published_at: -1 })
          .skip(skip)
          .limit(limit),
      ]);
 
      res.status(200).json({
        success: true,
        pagination: getPaginationMeta(total, page, limit, articles.length),
        data: articles,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async getArticle(req, res, next) {
    try {
      const article = await Article.findById(req.params.id).populate("author_id", "name role");
 
      if (!article) {
        return next(createError(404, "Article not found"));
      }
 
      res.status(200).json({ success: true, data: article });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async createArticle(req, res, next) {
    try {
      const { title, content, category, img, video } = req.body;
 
      const article = await Article.create({
        author_id: req.user._id,
        title,
        content,
        category,
        img,
        video,
      });
 
      const populated = await article.populate("author_id", "name role");
 
      res.status(201).json({
        success: true,
        message: "Article created",
        data: populated,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async updateArticle(req, res, next) {
    try {
      const article = await Article.findById(req.params.id);
 
      if (!article) {
        return next(createError(404, "Article not found"));
      }
 
      const isOwner = article.author_id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";
 
      if (!isOwner && !isAdmin) {
        return next(createError(403, "Forbidden: you can only edit your own articles"));
      }
 
      const { title, content, category, img, video } = req.body;
      const updated = await Article.findByIdAndUpdate(
        req.params.id,
        { title, content, category, img, video },
        { new: true, runValidators: true }
      ).populate("author_id", "name role");
 
      res.status(200).json({ success: true, message: "Article updated", data: updated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
 
  async deleteArticle(req, res, next) {
    try {
      const article = await Article.findById(req.params.id);
 
      if (!article) {
        return next(createError(404, "Article not found"));
      }
 
      const isOwner = article.author_id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";
 
      if (!isOwner && !isAdmin) {
        return next(createError(403, "Forbidden: you can only delete your own articles"));
      }
 
      await Article.findByIdAndDelete(req.params.id);
 
      res.status(200).json({ success: true, message: "Article deleted" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}
 
module.exports = new ArticleController();
