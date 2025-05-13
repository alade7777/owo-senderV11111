const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");

// Import des routes
const authRoutes = require("./routes/auth");
const sendRoute = require("./routes/send");

const app = express();
// Utiliser le port de Render (10000) ou le port local (3000)
const PORT = process.env.PORT || 10000;

// Configuration CORS
app.use(cors({
  origin: ['https://owo-sender.onrender.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Email']
}));

// Middleware de logging pour les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Middleware pour gérer les sessions
app.use(session({
  secret: 'votre_secret_tres_securise',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// Middlewares pour le parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend statique
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/send", sendRoute);

// Route d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour servir envoie.html
app.get('/envoie.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'envoie.html'));
});

// Route pour servir admin.html
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
  console.log("Route non trouvée:", req.method, req.url);
  res.status(404).json({ message: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({
    message: 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne du serveur'
  });
});

// Connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ALADE:ALADE7777@cluster0.jjfxgas.mongodb.net/owo-sender?retryWrites=true&w=majority&appName=Cluster0';

console.log('Tentative de connexion à MongoDB...');
console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Masquer le mot de passe dans les logs

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout après 5 secondes
  socketTimeoutMS: 45000, // Timeout des opérations après 45 secondes
})
.then(() => {
  console.log('✅ Connecté à MongoDB');
  // Lancement du serveur
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  });
})
.catch(err => {
  console.error('❌ Erreur de connexion à MongoDB:', err);
  console.error('Détails de l\'erreur:', {
    name: err.name,
    message: err.message,
    code: err.code,
    codeName: err.codeName
  });
  process.exit(1);
});

// Gestion des événements de connexion MongoDB
mongoose.connection.on('error', err => {
  console.error('❌ Erreur de connexion MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Déconnecté de MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ Reconnexion à MongoDB réussie');
});

// Mail (si utilisé ailleurs)
const nodemailer = require("nodemailer");

const usersFile = path.join(__dirname, "data", "users.json");
const resetCodesFile = path.join(__dirname, "data", "reset-codes.json");

// Fonctions utilitaires
function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
