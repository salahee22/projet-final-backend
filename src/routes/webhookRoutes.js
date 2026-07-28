// routes/webhook.routes.js
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { verifySignature } = require('@chargily/chargily-pay');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Middleware pour capturer le body brut (obligatoire pour vérifier la signature)
router.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

router.post('/webhook', async (req, res) => {
  const signature = req.get('signature') || '';
  const payload = req.rawBody;

  if (!signature) return res.sendStatus(400);

  try {
    if (!verifySignature(payload, signature, process.env.CHARGILY_WEBHOOK_SECRET)) {
      console.log('Signature invalide');
      return res.sendStatus(403);
    }
  } catch (err) {
    console.error('Erreur vérification signature:', err);
    return res.sendStatus(403);
  }

  const event = req.body;

  try {
    if (event.type === 'checkout.paid') {
      const checkoutId = event.data.id;
      const sub = await Subscription.findOne({ checkoutId });

      if (sub) {
        sub.status = 'active';
        sub.paidAt = new Date();
        await sub.save();

        // Active l'accès premium de l'utilisateur
        await User.findByIdAndUpdate(sub.user, {
          subscriptionStatus: 'active',
          subscriptionPlan: sub.plan,
        });
      }
    }

    if (event.type === 'checkout.failed') {
      const checkoutId = event.data.id;
      await Subscription.findOneAndUpdate({ checkoutId }, { status: 'failed' });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Erreur traitement webhook:', err);
    res.sendStatus(500);
  }
});

module.exports = router;