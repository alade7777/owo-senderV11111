// Vérifier si l'utilisateur est connecté en tant qu'admin
function isAdmin() {
  const userEmail = localStorage.getItem("userEmail");
  return userEmail === "igell7777@gmail.com"; // Email admin mis à jour
}

// Rediriger vers la page de connexion si l'utilisateur n'est pas admin
function checkAdminAccess() {
  if (!isAdmin()) {
    window.location.href = "connexion.html";
  }
}

// Mettre à jour le lien de contact pour les admins
function updateContactLink() {
  const contactLink = document.getElementById("contactLink");
  if (contactLink && isAdmin()) {
    contactLink.href = "contact.html";
    contactLink.innerHTML = '<i class="fas fa-envelope"></i> Contact';
  }
}

// Vérifier l'accès admin au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
  updateContactLink();
}); 