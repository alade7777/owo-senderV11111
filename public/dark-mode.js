// Fonction pour vérifier les préférences système
function checkSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Fonction pour appliquer le thème
function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Mettre à jour le toggle si présent
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) {
    darkToggle.checked = isDark;
  }
}

// Fonction pour gérer le changement de thème système
function handleSystemThemeChange(e) {
  // Si l'utilisateur a explicitement choisi un thème, on ne change pas
  if (localStorage.getItem('userTheme')) {
    return;
  }
  // Sinon, on suit le thème système
  applyTheme(e.matches);
}

// Écouter les changements de thème système
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);

// Initialisation du thème
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si l'utilisateur a une préférence explicite
  const userTheme = localStorage.getItem('userTheme');
  
  if (userTheme) {
    // Utiliser la préférence explicite de l'utilisateur
    applyTheme(userTheme === 'dark');
  } else {
    // Sinon, utiliser les préférences système
    applyTheme(checkSystemTheme());
  }

  // Gestionnaire pour le toggle manuel
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) {
    darkToggle.addEventListener('change', function() {
      // Sauvegarder le choix explicite de l'utilisateur
      localStorage.setItem('userTheme', this.checked ? 'dark' : 'light');
      applyTheme(this.checked);
    });
  }
}); 