const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const cors = require("cors");

// Import des routes
const authRoutes = require("./routes/auth");
const sendRoute = require("./routes/send");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS - doit être avant les autres middlewares
app.use(cors({
  origin: true, // Autoriser toutes les origines en développement
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Email', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400 // 24 heures
}));

// Middleware pour gérer les sessions
app.use(session({
  secret: process.env.SESSION_SECRET || "ma-cle-secrete",
  resave: false,
  saveUninitialized: false,
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
  res.status(404).json({ message: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur est survenue sur le serveur" });
});

// Lancement du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
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
