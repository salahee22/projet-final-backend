const express = require("express");
const conversationController = require("../controllers/conversationController");
const verifyToken = require("../middlewares/verifyToken");
const requirePlan = require("../middlewares/requirePlan");

const router = express.Router();

router.use(verifyToken);
router.use(requirePlan("premium"));

router.get("/unread-count", conversationController.getUnreadCount);
router.get("/", conversationController.listConversations);
router.post("/", conversationController.getOrCreateConversation);
router.get("/:id/messages", conversationController.getMessages);
router.post("/:id/messages", conversationController.sendMessage);

module.exports = router;