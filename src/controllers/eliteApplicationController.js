const crypto = require("crypto");
const { verifySignature } = require("@chargily/chargily-pay");
const EliteApplication = require("../models/EliteApplication");
const User = require("../models/User");
const ProfilPlayer = require("../models/ProfilPlayer");
const Subscription = require("../models/Subscription");
const createError = require("../utils/createError");
const { hashPassword } = require("../utils/password");
const { getPagination, getPaginationMeta } = require("../utils/queryHelpers");
const chargilyClient = require("../utils/chargily");

const PLAN_MAP = { elite1: "basic", elite2: "premium", elite3: "elite" };
const PRICE_MAP = { elite1: 4500, elite2: 8500, elite3: 14000 };

class EliteApplicationController {
  constructor() {
    this.createApplication = this.createApplication.bind(this);
    this.listApplications = this.listApplications.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.acceptApplication = this.acceptApplication.bind(this);
    this.deleteApplication = this.deleteApplication.bind(this);
    this.handleWebhook = this.handleWebhook.bind(this);
    this.activateFromPayment = this.activateFromPayment.bind(this);
  }

  normalizeError(error) {
    if (error.statusCode) return error;
    if (error.name === "ValidationError") return createError(400, error.message);
    return error;
  }

  // Public — crée la demande PUIS un checkout Chargily, renvoie l'URL de paiement
  async createApplication(req, res, next) {
    try {
      const { nom, prenom, age, poste, niveau, club, telephone, email, message, offre } = req.body;
      const application = await EliteApplication.create({
        nom, prenom, age, poste, niveau, club, telephone, email, message, offre,
      });

      const amount = PRICE_MAP[offre];

      const checkout = await chargilyClient.createCheckout({
        amount,
        currency: "dzd",
        success_url: `${process.env.FRONTEND_URL}/elite/merci?application=${application._id}`,
        failure_url: `${process.env.FRONTEND_URL}/elite?payment=failed`,
        webhook_endpoint: `${process.env.BACKEND_URL}/api/elite-applications/webhook`,
        description: `Programme Elite - ${offre} - ${prenom} ${nom}`,
        metadata: { application_id: application._id.toString() },
      });

      application.checkout_id = checkout.id;
      await application.save();

      res.status(201).json({
        success: true,
        message: "Application submitted",
        data: { application, checkout_url: checkout.checkout_url },
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  // Webhook Chargily — appelé par leurs serveurs, pas par le navigateur
  async handleWebhook(req, res) {
    try {
      const signature = req.get("signature") || "";
      const payload = req.rawBody;

      if (!signature || !verifySignature(payload, signature, process.env.CHARGILY_API_SECRET)) {
        return res.sendStatus(403);
      }

      const event = req.body;

      if (event.type === "checkout.paid") {
        const applicationId = event.data.metadata?.application_id;
        if (applicationId) {
          await this.activateFromPayment(applicationId);
        }
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Webhook error:", error.message);
      res.sendStatus(500);
    }
  }

  // Logique partagée : créer/mettre à jour le compte joueur après paiement confirmé
  async activateFromPayment(applicationId) {
    const application = await EliteApplication.findById(applicationId);
    if (!application || application.status === "acceptee") return;

    let user = await User.findOne({ email: application.email });
    let tempPassword = null;

    if (!user) {
      tempPassword = crypto.randomBytes(6).toString("hex");
      const password_hash = await hashPassword(tempPassword);
      user = await User.create({
        name: `${application.prenom} ${application.nom}`,
        email: application.email,
        password_hash,
        role: "player",
      });
    }

    const existingProfil = await ProfilPlayer.findOne({ user_id: user._id });
    if (!existingProfil) {
      await ProfilPlayer.create({
  user_id: user._id,
  position: application.poste,
  club: application.club || null,
  phone: application.telephone || null,
});
    }

    const startsAt = new Date();
    const endsAt = new Date();
    endsAt.setMonth(endsAt.getMonth() + 1);

    await Subscription.create({
      user_id: user._id,
      plan_name: PLAN_MAP[application.offre] || "basic",
      price: PRICE_MAP[application.offre] || 0,
      starts_at: startsAt,
      ends_at: endsAt,
    });

    application.status = "acceptee";
    application.payment_status = "paye";
    await application.save();

    // TODO: envoyer tempPassword au joueur par email/SMS ici si tu ajoutes un service d'envoi
    console.log(`Compte activé pour ${application.email}, mot de passe temporaire: ${tempPassword || "(compte existant)"}`);
  }

  async listApplications(req, res, next) {
    try {
      const filter = {};
      if (req.query.status) filter.status = req.query.status;

      const { page, limit, skip } = getPagination(req.query);
      const [total, applications] = await Promise.all([
        EliteApplication.countDocuments(filter),
        EliteApplication.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
      ]);

      res.status(200).json({
        success: true,
        pagination: getPaginationMeta(total, page, limit, applications.length),
        data: applications,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async updateStatus(req, res, next) {
    try {
      const updated = await EliteApplication.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      if (!updated) return next(createError(404, "Application not found"));
      res.status(200).json({ success: true, message: "Status updated", data: updated });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  // Acceptation manuelle depuis le dashboard (garde ce chemin pour les cas hors ligne / espèces)
  async acceptApplication(req, res, next) {
    try {
      const application = await EliteApplication.findById(req.params.id);
      if (!application) return next(createError(404, "Application not found"));
      if (application.status === "acceptee") {
        return next(createError(409, "Cette demande a déjà été acceptée"));
      }

      await this.activateFromPayment(application._id);
      const updated = await EliteApplication.findById(req.params.id);

      res.status(200).json({
        success: true,
        message: "Application acceptée manuellement",
        data: { application: updated },
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async deleteApplication(req, res, next) {
    try {
      const deleted = await EliteApplication.findByIdAndDelete(req.params.id);
      if (!deleted) return next(createError(404, "Application not found"));
      res.status(200).json({ success: true, message: "Application deleted" });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

module.exports = new EliteApplicationController();