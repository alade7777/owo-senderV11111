const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');

// Chemins vers les fichiers JSON
const transfertsFilePath = path.join(__dirname, '..', 'transferts.json');
const usersFilePath = path.join(__dirname, '..', 'users.json');

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userEmail = req.headers['x-user-email'];

  if (!token || !userEmail) {
    return res.status(401).json({ message: 'Token ou email manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");
    if (decoded.email !== userEmail) {
      return res.status(403).json({ message: 'Token invalide pour cet utilisateur' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Fonction pour lire les transferts
async function readTransferts() {
  try {
    const data = await fs.readFile(transfertsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Fonction pour écrire les transferts
async function writeTransferts(transferts) {
  await fs.writeFile(transfertsFilePath, JSON.stringify(transferts, null, 2));
}

// Route pour créer un nouveau transfert
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      pays,
      montant,
      total,
      operateur,
      numero,
      nom,
      message,
      envoyeurNom,
      envoyeurNumero,
      userEmail
    } = req.body;

    // Validation des données
    if (!pays || !montant || !operateur || !numero || !nom || !envoyeurNom || !envoyeurNumero) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Validation du montant
    if (montant <= 0) {
      return res.status(400).json({ message: 'Le montant doit être supérieur à 0' });
    }

    // Création du nouveau transfert
    const transfert = {
      id: Date.now().toString(),
      pays,
      montant,
      total,
      operateur,
      numero,
      nom,
      message: message || '',
      envoyeurNom,
      envoyeurNumero,
      userEmail,
      date: new Date().toISOString(),
      statut: 'en_attente'
    };

    // Lecture et mise à jour des transferts
    const transferts = await readTransferts();
    transferts.push(transfert);
    await writeTransferts(transferts);

    res.status(201).json({
      message: 'Transfert enregistré avec succès',
      transfert
    });
  } catch (error) {
    console.error('Erreur lors de la création du transfert:', error);
    res.status(500).json({ message: 'Erreur lors de la création du transfert' });
  }
});

// Route pour obtenir l'historique des transferts d'un utilisateur
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const transferts = await readTransferts();
    const userTransferts = transferts.filter(t => t.userEmail === req.user.email);
    res.json(userTransferts);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
});

module.exports = router; 