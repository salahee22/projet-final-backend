const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const createError = require("../utils/createError");

class ConversationController {
  constructor() {
    this.listConversations = this.listConversations.bind(this);
    this.getOrCreateConversation = this.getOrCreateConversation.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getUnreadCount = this.getUnreadCount.bind(this);
  }

  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }

  async listConversations(req, res, next) {
    try {
      const conversations = await Conversation.find({ participants: req.user._id })
        .populate("participants", "name email role")
        .sort({ last_message_at: -1 });

      const withUnread = await Promise.all(
        conversations.map(async (conv) => {
          const unread = await Message.countDocuments({
            conversation_id: conv._id,
            sender_id: { $ne: req.user._id },
            read: false,
          });
          return { ...conv.toObject(), unread_count: unread };
        })
      );

      res.status(200).json({ success: true, data: withUnread });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async getOrCreateConversation(req, res, next) {
    try {
      const { participant_id } = req.body;

      if (!participant_id) {
        return next(createError(400, "participant_id is required"));
      }

      if (participant_id === req.user._id.toString()) {
        return next(createError(400, "Cannot start a conversation with yourself"));
      }

      // Si l'utilisateur courant est coach/admin, vérifie le plan du joueur ciblé
      const isCoach = req.user.role === "coach" || req.user.role === "admin";
      if (isCoach) {
        const targetUser = await User.findById(participant_id);
        if (targetUser && targetUser.role === "player") {
          const sub = await Subscription.findOne({
            user_id: participant_id,
            ends_at: { $gte: new Date() },
          });
          if (!sub || sub.plan_name === "basic") {
            return next(createError(403, "La messagerie est réservée aux joueurs Elite 2 et Elite 3"));
          }
        }
      }

      let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, participant_id], $size: 2 },
      }).populate("participants", "name email role");

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, participant_id],
        });
        conversation = await conversation.populate("participants", "name email role");
      }

      res.status(200).json({ success: true, data: conversation });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async getMessages(req, res, next) {
    try {
      const conversation = await Conversation.findById(req.params.id);

      if (!conversation) {
        return next(createError(404, "Conversation not found"));
      }

      const isParticipant = conversation.participants
        .map((p) => p.toString())
        .includes(req.user._id.toString());

      if (!isParticipant) {
        return next(createError(403, "Forbidden"));
      }

      const messages = await Message.find({ conversation_id: conversation._id })
        .sort({ created_at: 1 });

      await Message.updateMany(
        { conversation_id: conversation._id, sender_id: { $ne: req.user._id }, read: false },
        { $set: { read: true } }
      );

      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async sendMessage(req, res, next) {
    try {
      const { content } = req.body;

      if (!content || !content.trim()) {
        return next(createError(400, "content is required"));
      }

      const conversation = await Conversation.findById(req.params.id);

      if (!conversation) {
        return next(createError(404, "Conversation not found"));
      }

      const isParticipant = conversation.participants
        .map((p) => p.toString())
        .includes(req.user._id.toString());

      if (!isParticipant) {
        return next(createError(403, "Forbidden"));
      }

      const message = await Message.create({
        conversation_id: conversation._id,
        sender_id: req.user._id,
        content: content.trim(),
      });

      conversation.last_message = content.trim();
      conversation.last_message_at = new Date();
      await conversation.save();

      res.status(201).json({ success: true, data: message });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const conversations = await Conversation.find({ participants: req.user._id }).select("_id");
      const conversationIds = conversations.map((c) => c._id);

      const count = await Message.countDocuments({
        conversation_id: { $in: conversationIds },
        sender_id: { $ne: req.user._id },
        read: false,
      });

      res.status(200).json({ success: true, data: { count } });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

module.exports = new ConversationController();