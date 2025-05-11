document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // ===== Connexion =====
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");

      emailError.textContent = "";
      passwordError.textContent = "";

      if (!email || !password) {
        if (!email) emailError.textContent = "L'adresse email est requise.";
        if (!password) passwordError.textContent = "Le mot de passe est requis.";
        return;
      }

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userName", data.user.fullname);
          const toast = document.getElementById("toastSuccess");
          const bsToast = new bootstrap.Toast(toast);
          toast.querySelector(".toast-body").textContent = "Connexion réussie !";
          bsToast.show();
          setTimeout(() => window.location.href = "index.html", 1500);
        } else {
          alert(data.message || "Erreur de connexion.");
        }
      } catch {
        alert("Erreur réseau.");
      }
    });
  }

  // ===== Inscription =====
  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const fullname = document.getElementById("fullname").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;
      const confirm = document.getElementById("confirmPassword").value;

      const fullnameError = document.getElementById("fullnameError");
      const emailError = document.getElementById("emailSignupError");
      const passwordError = document.getElementById("passwordSignupError");
      const confirmError = document.getElementById("confirmPasswordError");

      fullnameError.textContent = "";
      emailError.textContent = "";
      passwordError.textContent = "";
      confirmError.textContent = "";

      let valid = true;
      if (!fullname) {
        fullnameError.textContent = "Le nom complet est requis.";
        valid = false;
      }
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        emailError.textContent = "Adresse email invalide.";
        valid = false;
      }
      if (!password || password.length < 6) {
        passwordError.textContent = "Mot de passe trop court.";
        valid = false;
      }
      if (password !== confirm) {
        confirmError.textContent = "Les mots de passe ne correspondent pas.";
        valid = false;
      }

      if (!valid) return;

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullname, email, password })
        });

        const data = await response.json();
        if (response.ok) {
          const toast = document.getElementById("toastSuccess");
          const bsToast = new bootstrap.Toast(toast);
          toast.querySelector(".toast-body").textContent = "Inscription réussie !";
          bsToast.show();
          setTimeout(() => window.location.href = "connexion.html", 1500);
        } else {
          alert(data.message || "Erreur lors de l'inscription.");
        }
      } catch {
        alert("Erreur réseau.");
      }
    });
  }

  // ===== UI GÉNÉRALE POUR INDEX.HTML =====
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");
  const avatar = document.getElementById("userAvatar");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileCard = document.getElementById("profileCard");

  if (email) {
    document.getElementById("connexionBtn")?.classList.add("d-none");
    document.getElementById("userWidget")?.classList.remove("d-none");

    if (avatar && name) {
      avatar.textContent = name.trim().charAt(0).toUpperCase();
    }

    if (email === "igell7777@gmail.com") {
      document.getElementById("adminBtn")?.classList.remove("d-none");
    }
  }

  // ===== Affichage profil =====
  document.getElementById("openProfile")?.addEventListener("click", () => {
    if (profileName) profileName.textContent = name || "-";
    if (profileEmail) profileEmail.textContent = email || "-";
    profileCard?.classList.remove("d-none");
  });

  // ===== Déconnexion =====
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    window.location.href = "index.html";
  });

  // ===== Fermer carte profil =====
  window.closeProfile = function () {
    document.getElementById("profileCard")?.classList.add("d-none");
  };

  // ===== Dark Mode =====
  const darkToggle = document.getElementById("darkModeToggle");
  const isDark = localStorage.getItem("theme") === "dark";
  if (isDark) document.body.classList.add("dark");
  if (darkToggle) darkToggle.checked = isDark;

  darkToggle?.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  // ===== Bouton Envoyer de l'argent =====
  const sendMoneyBtn = document.getElementById("sendMoneyBtn");
  sendMoneyBtn?.addEventListener("click", function () {
    if (email) {
      window.location.href = "envoie.html";
    } else {
      window.location.href = "connexion.html";
    }
  });
});

// === Traduction automatique ===
document.addEventListener("DOMContentLoaded", function () {
  const langSelect = document.getElementById("languageSelect");
  const currentLang = localStorage.getItem("lang") || "fr";

  if (langSelect) langSelect.value = currentLang;
  updateLanguage(currentLang);

  if (langSelect) {
    langSelect.addEventListener("change", () => {
      const lang = langSelect.value;
      localStorage.setItem("lang", lang);
      updateLanguage(lang);
    });
  }

  function updateLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[lang] && translations[lang][key]) {
        el.setAttribute("placeholder", translations[lang][key]);
      }
    });
  }
});

// === bouton rebondir ===
document.getElementById("sendMoneyBtn")?.classList.add("bounce");

