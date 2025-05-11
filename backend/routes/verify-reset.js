const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Fichiers JSON
const usersFile = path.join(__dirname, "../data/users.json");
const resetCodesFile = path.join(__dirname, "../data/reset-codes.json");

// Utilitaires JSON
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Route POST /api/verify-reset-code
router.post("/verify-reset-code", (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: "Champs manquants." });
  }

  const resetCodes = readJSON(resetCodesFile);
  const record = resetCodes.find(r => r.email === email && r.code === code);

  if (!record) {
    return res.status(400).json({ message: "Code invalide." });
  }

  // Vérifie si le code est expiré (10 min)
  const now = Date.now();
  const diff = now - record.createdAt;
  if (diff > 10 * 60 * 1000) {
    return res.status(400).json({ message: "Code expiré." });
  }

  // Mise à jour du mot de passe de l'utilisateur
  const users = readJSON(usersFile);
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Utilisateur introuvable." });
  }

  users[userIndex].password = newPassword; // 👈 Tu peux ajouter un hash ici si tu veux

  writeJSON(usersFile, users);

  // Supprimer le code utilisé
  const updatedCodes = resetCodes.filter(r => r.email !== email);
  writeJSON(resetCodesFile, updatedCodes);

  return res.json({ message: "Mot de passe mis à jour avec succès." });
});

module.exports = router;
