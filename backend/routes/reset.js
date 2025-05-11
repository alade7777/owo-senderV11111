const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Emplacements des fichiers JSON
const usersFile = path.join(__dirname, "../../users.json");
const resetCodesFile = path.join(__dirname, "../../reset-codes.json");

// Fonction pour lire un fichier JSON
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// Fonction pour écrire dans un fichier JSON
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Transporteur mail à configurer avec ton Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ton.email@gmail.com",         // 🔁 Remplace par ton adresse Gmail
    pass: "ton-mot-de-passe-app"         // 🔁 Remplace par ton mot de passe d'application Gmail
  }
});

// Route POST pour envoyer le code de réinitialisation
router.post("/send-reset-code", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email requis." });
  }

  const users = readJSON(usersFile);
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "Aucun compte trouvé avec cet e-mail." });
  }

  const code = crypto.randomInt(100000, 999999).toString();

  let resetCodes = readJSON(resetCodesFile);
  resetCodes = resetCodes.filter(item => item.email !== email); // Nettoyer les anciens codes
  resetCodes.push({ email, code, createdAt: Date.now() });
  writeJSON(resetCodesFile, resetCodes);

  const mailOptions = {
    from: "ton.email@gmail.com",
    to: email,
    subject: "Code de réinitialisation de mot de passe",
    text: `Voici votre code de réinitialisation : ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur d'envoi :", error);
      return res.status(500).json({ message: "Erreur lors de l'envoi de l'e-mail." });
    } else {
      console.log("Email envoyé :", info.response);
      return res.json({ message: "Code envoyé avec succès." });
    }
  });
});

module.exports = router;
