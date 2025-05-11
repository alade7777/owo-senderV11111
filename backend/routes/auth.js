// auth.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const USERS_FILE = path.join(__dirname, "../users.json");

// Lire les utilisateurs
function readUsers() {
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

// Écrire les utilisateurs
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ✅ Inscription
router.post("/signup", (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const users = readUsers();
  const userExists = users.find(u => u.email === email);

  if (userExists) {
    return res.status(409).json({ message: "Cet email est déjà utilisé." });
  }

  users.push({ fullname, email, password });
  writeUsers(users);

  res.status(201).json({ message: "Inscription réussie." });
});

// ✅ Connexion
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect." });
  }

  // ✅ Stocker l'utilisateur dans la session
  req.session.user = {
    email: user.email,
    fullname: user.fullname,
    isAdmin: user.email === "igell7777@gmail.com" // si c'est ton admin
  };

  res.status(200).json({ message: "Connexion réussie.", user: req.session.user });
});

// ✅ Déconnexion
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion." });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Déconnexion réussie." });
  });
});

module.exports = router;

// ✅ Vérifier si l'utilisateur est connecté
router.get("/check", (req, res) => {
  if (req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});
