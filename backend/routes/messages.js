// routes/messages.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const MESSAGES_FILE = path.join(__dirname, "../data/messages.json");

// Lire les messages depuis le fichier
function readMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) return [];
  return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
}

// Écrire les messages dans le fichier
function writeMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// POST - Envoi d'un message
router.post("/", (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: "Email et message requis." });
  }

  const messages = readMessages();

  const newMessage = {
    id: uuidv4(),
    email,
    message,
    date: new Date().toISOString()
  };

  messages.push(newMessage);
  writeMessages(messages);

  res.status(201).json({ message: "Message enregistré avec succès." });
});

// GET - Obtenir les messages d'un utilisateur (via query ?email=...)
router.get("/", (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ message: "Email requis en paramètre." });
  }

  const messages = readMessages();
  const userMessages = messages.filter(m => m.email === email);

  res.json(userMessages);
});

module.exports = router;
