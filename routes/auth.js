const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Chemin vers le fichier users.json
const usersFilePath = path.join(__dirname, '..', 'users.json');

// Fonction pour lire les utilisateurs
async function readUsers() {
  try {
    const data = await fs.readFile(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "votre_secret_jwt",
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        country: user.country
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, country } = req.body;
    const users = await readUsers();

    if (users.some(u => u.email === email)) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      phone,
      country
    };

    users.push(newUser);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || "votre_secret_jwt",
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        country: newUser.country
      }
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

module.exports = router; 