const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const cors = require("cors");

const authRoutes = require("./backend/routes/auth");
const sendRoute = require("./backend/routes/send");
const transfertRoutes = require("./backend/routes/transfert");
const resetRoute = require("./backend/routes/reset");
const verifyRoute = require("./backend/routes/verify-reset");
const messageRoute = require("./backend/routes/messages");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware pour CORS
app.use(cors());

// Middleware pour gérer les sessions
app.use(session({
  secret: process.env.JWT_SECRET || "ma-cle-secrete",
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
app.use("/api/transfert", transfertRoutes);
app.use("/api", resetRoute);
app.use("/api", verifyRoute);
app.use("/api/messages", messageRoute);

// Route d'accueil
app.get("/", (req, res) => {
  res.send("Bienvenue sur OWO-SENDER API !");
});

// Lancement du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
}); 