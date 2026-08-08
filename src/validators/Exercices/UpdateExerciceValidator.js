const { body } = require("express-validator");
 
const THEMES = [
  "Passe", "Tir", "Dribble", "Conduite de balle", "Contrôle",
  "Jeu collectif", "Vitesse", "Endurance", "Coordination",
  "Prise de balle", "Plongeons", "Relance", "Placement", "Réflexes", "Sorties aériennes",
];
 
// Mêmes règles que createExerciceValidator, mais TOUT est optionnel puisqu'une mise à jour
// peut ne toucher qu'un sous-ensemble de champs. ATTENTION : compare avec ton fichier actuel
// updateExerciceValidator.js avant d'écraser, au cas où tu avais des règles spécifiques dessus
// que je n'ai pas vues.
module.exports = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty").isLength({ min: 3, max: 200 }),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
  body("objective").optional().trim().notEmpty().withMessage("Objective cannot be empty"),
  body("material").optional({ nullable: true }).isString(),
  body("theme").optional().isIn(THEMES).withMessage("Invalid theme"),
  body("age").optional().isIn(["U7", "U9", "U11", "U13", "U15", "U17", "Senior"]).withMessage("Invalid age"),
  body("level").optional().isIn(["Débutant", "Intermédiaire", "Avancé"]),
  body("type").optional().isIn(["field", "goalkeeper"]),
  body("duration").optional().isString(),
 
  body("image")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Le lien de l'image principale est invalide"),
 
  body("images")
    .optional()
    .isArray().withMessage("images must be an array"),
  body("images.*")
    .optional({ checkFalsy: true })
    .isURL().withMessage("each image must be a valid URL"),
 
  body("video")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Le lien de la vidéo est invalide"),
 
  body("detail_image")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Le lien de l'image détaillée est invalide"),
 
  body("sections").optional().isArray(),
  body("sections.*.title").optional().isString(),
 
  body("blocs").optional().isArray(),
  body("blocs.*.title").optional().isString(),
  body("blocs.*.image")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Le lien de l'image du bloc est invalide"),
  body("blocs.*.video")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Le lien de la vidéo du bloc est invalide"),
  body("blocs.*.planImages").optional().isArray(),
  body("blocs.*.planImages.*.img")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Le lien d'une image de plan est invalide"),
  body("blocs.*.organisation").optional().isObject(),
  body("blocs.*.consignes").optional().isObject(),
  body("blocs.*.roles").optional().isObject(),
 
  body("planImages").optional().isArray(),
  body("organisation").optional().isObject(),
  body("consignes").optional().isObject(),
  body("roles").optional().isObject(),
 
  body("categories").optional().isArray(),
  body("subThemes").optional().isArray(),
];