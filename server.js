const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session"); // ✅ Ajouté

const authRoutes = require("./routes/auth");
const sendRoute = require("./routes/send");
const transfertRoutes = require("./routes/transfert");
const resetRoute = require("./routes/reset");
const verifyRoute = require("./routes/verify-reset");
const messageRoute = require("./routes/messages"); // 👈 ajoute cette ligne en haut avec les autres


const app = express();
const PORT = 3000;

// ✅ Middleware pour gérer les sessions
app.use(session({
  secret: "ma-cle-secrete", // 🔐 À sécuriser (mettre en .env si besoin)
  resave: false,
  saveUninitialized: false,
}));

// Middlewares pour le parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend statique
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/send", sendRoute);
app.use("/api/transfert", transfertRoutes);
app.use("/api", resetRoute);
app.use("/api", verifyRoute);
app.use("/api/messages", messageRoute); // 👈 ajoute cette ligne

// Route d'accueil
app.get("/", (req, res) => {
  res.send("Bienvenue sur mon serveur Node.js distant !");
});

// Lancement du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
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
