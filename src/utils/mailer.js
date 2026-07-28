const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendWelcomeEmail({ to, name, tempPassword }) {
  const mailOptions = {
    from: `"YASS TRAINING" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Bienvenue sur YASS TRAINING — Vos identifiants",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0A0A0A;">Bienvenue ${name} !</h2>
        <p style="color: #333; line-height: 1.6;">
          Votre paiement a été confirmé et votre compte YASS TRAINING est maintenant actif.
        </p>
        <div style="background: #F5F5F5; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Email de connexion</p>
          <p style="margin: 0 0 16px 0; color: #111; font-weight: 700;">${to}</p>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Mot de passe temporaire</p>
          <p style="margin: 0; color: #111; font-weight: 700; font-size: 18px;">${tempPassword}</p>
        </div>
        <p style="color: #333; line-height: 1.6;">
          Connectez-vous et pensez à changer ce mot de passe dans vos paramètres dès votre première connexion.
        </p>
        <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background: #C8A84B; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; margin-top: 12px;">
          Se connecter
        </a>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };