const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");

const filePath = path.join(__dirname, "..", "transferts.json");

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const userEmail = req.headers["x-user-email"];

  if (!token || !userEmail) {
    return res.status(401).json({ message: "Non autorisé. Token ou email manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== userEmail) {
      return res.status(401).json({ message: "Token invalide." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

// 📤 POST /api/send - Enregistrer un transfert
router.post("/", verifyToken, (req, res) => {
  const { pays, montant, total, operateur, numero, nom, message, envoyeurNom, envoyeurNumero } = req.body;
  const userEmail = req.user.email;

  console.log("Données reçues:", req.body);

  if (!pays || !montant || !total || !operateur || !numero || !nom || !envoyeurNom || !envoyeurNumero) {
    console.log("Champs manquants:", { pays, montant, total, operateur, numero, nom, envoyeurNom, envoyeurNumero });
    return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
  }

  if (typeof montant !== "number" || montant <= 0 || typeof total !== "number") {
    return res.status(400).json({ message: "Montant invalide." });
  }

  const nouveauTransfert = {
    id: Date.now(),
    pays,
    montant,
    total,
    operateur,
    numero,
    nom,
    message: message || "",
    envoyeurNom: envoyeurNom || "",
    envoyeurNumero: envoyeurNumero || "",
    statut: "En attente",
    date: new Date().toISOString(),
    userEmail
  };

  console.log("Nouveau transfert à enregistrer:", nouveauTransfert);

  fs.readFile(filePath, "utf8", (err, data) => {
    let transferts = [];
    if (!err && data) {
      try {
        transferts = JSON.parse(data);
      } catch (parseErr) {
        console.error("Erreur de parsing JSON:", parseErr);
      }
    }

    transferts.push(nouveauTransfert);

    fs.writeFile(filePath, JSON.stringify(transferts, null, 2), (err) => {
      if (err) {
        console.error("Erreur d'écriture :", err);
        return res.status(500).json({ message: "Erreur interne serveur." });
      }

      console.log("Transfert enregistré avec succès:", nouveauTransfert);
      return res.status(200).json({ message: "Transfert enregistré avec succès !" });
    });
  });
});

// 📥 GET /api/send/all - Liste des transferts
router.get("/all", verifyToken, (req, res) => {
  const userEmail = req.user.email;
  const isAdmin = userEmail === "igell7777@gmail.com"; // Vérifie si c'est l'admin

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur lecture transferts.json:", err);
      return res.status(500).json({ message: "Erreur serveur lors de la lecture." });
    }

    try {
      let transferts = JSON.parse(data);
      // Si ce n'est pas l'admin, ne montrer que ses transferts
      if (!isAdmin) {
        transferts = transferts.filter(t => t.userEmail === userEmail);
      }
      res.json(transferts);
    } catch (parseErr) {
      console.error("Erreur de parsing JSON:", parseErr);
      res.status(500).json({ message: "Fichier corrompu." });
    }
  });
});

// 🔁 PATCH /api/send/update/:index - Mettre à jour le statut
router.patch("/update/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const { statut } = req.body;

  if (isNaN(index) || !statut) {
    return res.status(400).json({ message: "Index ou statut invalide." });
  }

  try {
    const data = fs.readFileSync(filePath);
    const transferts = JSON.parse(data);

    if (!transferts[index]) {
      return res.status(404).json({ message: "Transfert non trouvé." });
    }

    transferts[index].statut = statut;
    fs.writeFileSync(filePath, JSON.stringify(transferts, null, 2));
    res.json({ message: "Statut mis à jour." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ❌ DELETE /api/send/delete/:index - Supprimer un transfert
router.delete("/delete/:index", (req, res) => {
  const index = parseInt(req.params.index);

  try {
    const data = fs.readFileSync(filePath);
    const transferts = JSON.parse(data);

    if (!transferts[index]) {
      return res.status(404).json({ message: "Transfert non trouvé." });
    }

    transferts.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(transferts, null, 2));
    res.json({ message: "Transfert supprimé." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
