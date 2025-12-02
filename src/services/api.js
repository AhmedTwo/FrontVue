import axios from 'axios'

// Crée une instance personnalisée d'Axios.
// 'api' sera l'objet que nous utiliserons pour faire toutes nos requêtes HTTP.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api', // Définit l'URL de base pour toutes les requêtes.
  // Elle utilise une variable d'environnement (VITE_API_URL) pour la flexibilité.
  headers: {
    'Content-Type': 'application/json', // Indique que le corps des requêtes envoyées sera au format JSON.
  },
})

// Intercepteur de requêtes
// C'est une fonction qui s'exécute AVANT que chaque requête soit envoyée au serveur.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') // Récupère le jeton d'authentification (s'il existe) stocké localement.

    if (token) {
      // Si un jeton est trouvé, il est ajouté à l'en-tête 'Authorization' de la requête.
      // C'est essentiel pour les requêtes qui nécessitent d'être authentifiées (protégées).
      config.headers.Authorization = `Bearer ${token}`
    }
    return config // Retourne la configuration de la requête modifiée (avec le token) pour qu'elle soit envoyée.
  }, // Fonction appelée si une erreur survient lors de la préparation de la requête (rare).
  (error) => Promise.reject(error),
)

export default api // Exporte l'instance 'api' pour qu'elle puisse être utilisée dans toute l'application.
