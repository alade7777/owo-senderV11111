╔════════════════════════════════════════════════════╗
║        PROJET : Transfert Bénin-Congo (Web)       ║
╚════════════════════════════════════════════════════╝

📁 STRUCTURE DU PROJET
───────────────────────
/mon-projet
│
├── backend/
│   ├── server.js           → Serveur Node.js avec Express
│   ├── users.json          → Stockage local des utilisateurs
│   └── routes/
│       └── auth.js         → Routes API : login & inscription
│
├── public/
│   ├── index.html          → Page d’accueil
│   ├── connexion.html      → Formulaire de connexion
│   ├── inscription.html    → Formulaire d’inscription
│   ├── style.css           → Styles globaux + dark mode
│   └── script.js           → Gestion JS : formulaire, dark mode, toast
│
├── package.json            → Configuration du projet Node.js
└── README.txt              → Ce fichier explicatif

─────────────────────────────
🖥️ POUR LANCER LE BACKEND LOCAL :
─────────────────────────────
1. Installer les dépendances (dans le dossier racine) :
   > npm install

2. Lancer le serveur :
   > node backend/server.js

3. Accéder à l’app :
   http://localhost:3000/

─────────────────────────────
⚙️ FONCTIONNALITÉS FRONTEND :
─────────────────────────────
✔ Formulaire d'inscription avec validation
✔ Formulaire de connexion sécurisé
✔ Dark Mode activable depuis chaque page
✔ Avatar utilisateur affiché après connexion
✔ Toasts Bootstrap en cas de succès
✔ Stockage local de l'utilisateur avec localStorage

─────────────────────────────
📦 BACKEND EXPRESS :
─────────────────────────────
- `POST /api/signup` → Enregistre un nouvel utilisateur
- `POST /api/login`  → Vérifie les identifiants et retourne le nom

─────────────────────────────
📁 UTILISATEURS (users.json) :
─────────────────────────────
Ce fichier sert de base de données locale. Il est mis à jour automatiquement lors des inscriptions.

─────────────────────────────
📝 À FAIRE (si besoin) :
─────────────────────────────
- Ajouter la réinitialisation de mot de passe
- Gérer les sessions avec JWT (pour sécuriser)
- Intégrer une vraie base de données (MongoDB)

─────────────────────────────
✉️ CONTACT :
─────────────────────────────
Développeur : [Ton nom ici]
Projet initié : [Avril 2025]
