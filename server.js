const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const cors = require("cors");
const FileStore = require("session-file-store")(session);
require("dotenv").config();

const authRoutes = require("./backend/routes/auth");
const sendRoute = require("./backend/routes/send");
const transfertRoutes = require("./backend/routes/transfert");
const resetRoute = require("./backend/routes/reset");
const verifyRoute = require("./backend/routes/verify-reset");
const messageRoute = require("./backend/routes/messages");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware pour CORS
app.use(cors({
  origin: ["https://owo-sender.onrender.com", "http://localhost:3000"],
  credentials: true
}));

// Middleware pour gérer les sessions
app.use(session({
  store: new FileStore({
    path: path.join(__dirname, "sessions"),
    ttl: 86400, // 24 heures
    reapInterval: 3600 // Nettoyage toutes les heures
  }),
  secret: process.env.JWT_SECRET || "votre_secret_jwt",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
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
app.use("/api/transfert", transfertRoutes);
app.use("/api", resetRoute);
app.use("/api", verifyRoute);
app.use("/api/messages", messageRoute);

// Route d'accueil
app.get("/", (req, res) => {
  res.send("Bienvenue sur OWO-SENDER API !");
});

// Route pour toutes les autres requêtes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Lancement du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
}); 