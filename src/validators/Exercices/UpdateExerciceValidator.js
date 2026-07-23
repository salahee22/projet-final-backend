const { body, param } = require("express-validator");

const THEMES = [
  "Passe", "Tir", "Dribble", "Conduite de balle", "Contrôle",
  "Jeu collectif", "Vitesse", "Endurance", "Coordination",
  "Prise de balle", "Plongeons", "Relance", "Placement", "Réflexes", "Sorties aériennes",
];

module.exports = [
  param("id").isMongoId().withMessage("Exercice id must be a valid MongoDB id"),

  body("name").optional().trim().isLength({ min: 3, max: 200 }),
  body("description").optional().trim().notEmpty(),
  body("objective").optional().trim().notEmpty(),
  body("material").optional({ nullable: true }).isString(),
  body("theme").optional().isIn(THEMES),
  body("age").optional().isIn(["U7", "U9", "U11", "U13", "U15", "U17", "Senior"]),
  body("level").optional().isIn(["Débutant", "Intermédiaire", "Avancé"]),
  body("type").optional().isIn(["field", "goalkeeper"]),
  body("duration").optional().isString(),
  body("image").optional({ nullable: true }).isURL(),
  body("images")
  .optional()
  .isArray().withMessage("images must be an array"),
body("images.*")
  .optional()
  .isURL().withMessage("each image must be a valid URL"),
  body("video").optional({ nullable: true }).isURL(),

  body("detail_image").optional({ nullable: true }).isURL(),
  body("sections").optional().isArray(),
  body("planImages").optional().isArray(),
  body("organisation").optional().isObject(),
  body("consignes").optional().isObject(),
  body("roles").optional().isObject(),
  body("categories").optional().isArray(),
  body("subThemes").optional().isArray(),
];