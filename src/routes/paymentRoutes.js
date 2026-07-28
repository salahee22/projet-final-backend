// routes/payment.routes.js
const express = require('express');
const router = express.Router();
const chargilyClient = require('../config/chargily');
const Subscription = require('../models/Subscription');
const verifyToken = require('../middlewares/verifyToken');

router.post('/create-checkout', verifyToken, async (req, res) => {
  try {
    const { planName, amount } = req.body; // ex: 'Elite', 2500 (DZD)
    const user = req.user;

    const checkout = await chargilyClient.createCheckout({
      amount: amount,
      currency: 'dzd',
      payment_method: 'edahabia', // ou 'cib', ou laisse vide pour choix libre
      success_url: `${process.env.FRONTEND_URL}/dashboard/subscription/success`,
      failure_url: `${process.env.FRONTEND_URL}/dashboard/subscription/failed`,
      webhook_endpoint: `${process.env.BACKEND_URL}/api/payment/webhook`,
      description: `Abonnement ${planName} - YASS TRAINING`,
      metadata: [
        { userId: user._id.toString(), planName },
      ],
    });

    // On garde une trace "pending" en base
    await Subscription.create({
      user: user._id,
      plan: planName,
      amount,
      status: 'pending',
      checkoutId: checkout.id,
    });

    res.json({ checkout_url: checkout.checkout_url });
  } catch (err) {
    console.error('Erreur création checkout Chargily:', err);
    res.status(500).json({ message: 'Erreur lors de la création du paiement' });
  }
});

module.exports = router;