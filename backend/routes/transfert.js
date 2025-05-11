const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const transfertsPath = path.join(__dirname, "../transferts.json");

// 📤 POST /api/send - Nouveau transfert
router.post("/send", (req, res) => {
  const { pays, montant, operateur, numero, nom, message } = req.body;

  if (!pays || !montant || !operateur || !numero || !nom) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  if (isNaN(montant) || montant <= 0) {
    return res.status(400).json({ message: "Montant invalide." });
  }

  if (!/^\+\d{9,15}$/.test(numero)) {
    return res.status(400).json({ message: "Numéro invalide." });
  }

  const frais = Math.ceil(montant * 0.05);
  const total = montant + frais;

  const transfert = {
    id: Date.now(),
    pays,
    montant,
    total,
    operateur,
    numero,
    nom,
    message: message || "",
    statut: "En attente",
    date: new Date().toISOString()
  };

  let transferts = [];
  try {
    if (fs.existsSync(transfertsPath)) {
      transferts = JSON.parse(fs.readFileSync(transfertsPath));
    }
  } catch (err) {
    return res.status(500).json({ message: "Erreur lecture fichier." });
  }

  transferts.push(transfert);
  try {
    fs.writeFileSync(transfertsPath, JSON.stringify(transferts, null, 2));
    res.status(200).json({ message: "Transfert enregistré avec succès ✅", transfert });
  } catch (err) {
    res.status(500).json({ message: "Erreur écriture fichier." });
  }
});

// 📥 GET /api/send/all - Liste de tous les transferts
router.get("/all", (req, res) => {
  try {
    if (!fs.existsSync(transfertsPath)) {
      return res.json([]);
    }
    const data = fs.readFileSync(transfertsPath);
    const transferts = JSON.parse(data);
    res.json(transferts);
  } catch (err) {
    console.error("Erreur lecture des transferts:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// 🔁 PATCH /api/send/update/:index - Mettre à jour le statut d'un transfert
router.patch("/update/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const { statut } = req.body;

  if (isNaN(index) || !statut) {
    return res.status(400).json({ message: "Index ou statut invalide." });
  }

  try {
    const data = fs.readFileSync(transfertsPath);
    const transferts = JSON.parse(data);

    if (!transferts[index]) {
      return res.status(404).json({ message: "Transfert non trouvé." });
    }

    transferts[index].statut = statut;
    fs.writeFileSync(transfertsPath, JSON.stringify(transferts, null, 2));

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
    const data = fs.readFileSync(transfertsPath);
    const transferts = JSON.parse(data);

    if (!transferts[index]) {
      return res.status(404).json({ message: "Transfert non trouvé." });
    }

    transferts.splice(index, 1); // suppression
    fs.writeFileSync(transfertsPath, JSON.stringify(transferts, null, 2));

    res.json({ message: "Transfert supprimé." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
