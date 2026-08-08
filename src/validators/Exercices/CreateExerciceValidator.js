const { body } = require("express-validator");
 
const THEMES = [
  "Passe", "Tir", "Dribble", "Conduite de balle", "Contrôle",
  "Jeu collectif", "Vitesse", "Endurance", "Coordination",
  "Prise de balle", "Plongeons", "Relance", "Placement", "Réflexes", "Sorties aériennes",
];
 
module.exports = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 3, max: 200 }),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("objective").trim().notEmpty().withMessage("Objective is required"),
  body("material").optional({ nullable: true }).isString(),
  body("theme").notEmpty().isIn(THEMES).withMessage("Invalid theme"),
  body("age").notEmpty().isIn(["U7", "U9", "U11", "U13", "U15", "U17", "Senior"]).withMessage("Invalid age"),
  body("level").optional().isIn(["Débutant", "Intermédiaire", "Avancé"]),
  body("type").optional().isIn(["field", "goalkeeper"]),
  body("duration").optional().isString(),
 
  // checkFalsy: true -> saute la validation si "" / null / undefined.
  // Tous les champs image/vidéo sont optionnels : le frontend envoie "" par défaut.
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
 
  // --- Plusieurs exercices (blocs) dans une seule page ---
  // Chaque bloc = un mini sous-exercice avec sa propre image/vidéo (optionnelles)
  // et ses propres organisation / consignes / rôles.
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
 
  // Anciens champs conservés en option pour compatibilité avec les exercices existants
  // (créés avant l'ajout des blocs). Le nouveau formulaire n'envoie plus ces champs directement.
  body("planImages").optional().isArray(),
  body("organisation").optional().isObject(),
  body("consignes").optional().isObject(),
  body("roles").optional().isObject(),
 
  body("categories").optional().isArray(),
  body("subThemes").optional().isArray(),
];