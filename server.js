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
const PORT = process.env.PORT || 3000;

// Configuration CORS
const corsOptions = {
  origin: 'https://owo-sender.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Email', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware de logging pour les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Middleware CORS personnalisé
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://owo-sender.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Email, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('Requête OPTIONS reçue, envoi des en-têtes CORS');
    return res.status(200).end();
  }
  
  next();
});

// Middleware CORS d'Express
app.use(cors(corsOptions));

// Middleware pour gérer les sessions
app.use(session({
  secret: process.env.SESSION_SECRET || "ma-cle-secrete",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
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
  res.send("Bienvenue sur le serveur OWO-SENDER !");
});

// Gestion des erreurs 404
app.use((req, res) => {
  console.log("Route non trouvée:", req.method, req.url);
  res.status(404).json({ message: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);
  res.status(500).json({ message: "Une erreur est survenue sur le serveur" });
});

// Connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ALADE:2002@cluster0.jjfxgas.mongodb.net/owo-sender?retryWrites=true&w=majority&appName=Cluster0';

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
