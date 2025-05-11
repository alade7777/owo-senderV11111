document.addEventListener("DOMContentLoaded", () => {
    const resetForm = document.getElementById("reset-form");
    const sendCodeBtn = document.getElementById("sendCodeBtn");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const emailInput = document.getElementById("email");
    const codeInput = document.getElementById("code");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");
  
    // Étape 1 : Envoyer le code
    sendCodeBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      if (!email) {
        alert("Veuillez saisir votre adresse e-mail.");
        return;
      }
  
      try {
        const response = await fetch("/api/reset/send-reset-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert("Code envoyé à votre adresse e-mail !");
          step1.classList.add("d-none");
          step2.classList.remove("d-none");
        } else {
          alert(data.message || "Erreur lors de l'envoi.");
        }
      } catch (error) {
        alert("Erreur de connexion au serveur.");
        console.error(error);
      }
    });
  
    // Étape 2 : Soumettre le nouveau mot de passe
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = emailInput.value.trim();
      const code = codeInput.value.trim();
      const password = newPassword.value.trim();
      const confirm = confirmPassword.value.trim();
  
      if (password !== confirm) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }
  
      try {
        const response = await fetch("/api/reset/verify-reset-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, newPassword: password }),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert("Mot de passe réinitialisé avec succès !");
          window.location.href = "connexion.html";
        } else {
          alert(data.message || "Erreur lors de la réinitialisation.");
        }
      } catch (error) {
        alert("Erreur de connexion au serveur.");
        console.error(error);
      }
    });
  });
  