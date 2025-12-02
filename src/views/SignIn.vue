<script setup>
import ImagesPortal from '../assets/images/Portal.png'
import ImagesLogo from '../assets/images/imagePortal.png'

// --- 2. Importations des Librairies et Fonctions Vue/Externes ---
import { ref } from 'vue' // 'ref', fonction pour créer des variables réactives (qui mettent à jour l'interface automatiquement).
import api from '@/services/api' // instance d'Axios personnalisée pour faire les requêtes HTTP.
import { useRouter } from 'vue-router' // 'useRouter' permet de naviguer entre les pages après une action.
import { useUserStore } from '@/stores/user'

// --- 3. Initialisation et Variables Réactives ---
const router = useRouter() // le routeur : cela nous donne accès aux méthodes de navigation (comme 'push').
const errorMessage = ref('') // Variable réactive pour stocker et afficher les messages d'erreur à l'utilisateur.
const userStore = useUserStore()

// Variable réactive pour stocker les données du formulaire de connexion. (vide au départ)
const login = ref({
  email: '',
  password: '',
})

// --- 4. Fonction Principale de Connexion ---
// Fonction asynchrone pour gérer la soumission du formulaire.
const loginUser = async () => {
  try {
    // Tente d'envoyer une requête POST au serveur sur le point de terminaison '/login'.
    // 'login.value' contient l'objet { email: '...', password: '...' }.
    const responses = await api.post('/login', login.value) // Si la connexion réussit :
    // 1. Stocke le token d'authentification reçu du serveur dans le stockage local (LocalStorage).
    // C'est ce token qui sera automatiquement ajouté aux futures requêtes par l'intercepteur !
    localStorage.setItem('auth_token', responses.data.token)
    userStore.login(responses.data.user)
    // console.log(responses.data) // Affiche la réponse du serveur dans la console (pour débogage).
    router.push('/offers') // Redirige l'utilisateur vers la page '/Home'. suite de la connexion réussi.
  } catch (err) {
    console.log(err) // Affiche l'erreur complète dans la console (pour le développeur).
    // Vérifie si l'erreur est une réponse HTTP spécifique (ex: 401 Unauthorized).
    if (err.response && err.response.status === 401) {
      // Affiche un message d'erreur spécifique pour l'utilisateur.
      errorMessage.value = 'Votre email mot de passe et/ou mot de passe est incorrect !'
    } else {
      // Affiche un message d'erreur générique pour les autres types de problèmes.
      errorMessage.value = 'Veuillez remplir les champs !'
    }
  }
}
</script>

<template>
  <div id="containerFirst">
    <img :src="ImagesLogo" alt="fond logo portal job" class="background-logo" />
    <div id="containerSecond">
      <h1 class="h1Login">
        CONNEXION &nbsp;&nbsp;
        <img :src="ImagesPortal" alt="fond logo porte de portal job" width="35" />
      </h1>
      <!-- &nbsp; me permet de faire un espace en html -->

      <form id="loginForm" @submit.prevent="loginUser">
        <!-- ecoute la soumission du form avec @submit -->
        <!-- empeche le rechargement de la page avec .prevent -->
        <!-- pui sa execute la fonction loginUser -->
        <div class="divLogin">
          <label for="inputEmail">Email :</label>
          <input
            v-model="login.email"
            type="email"
            name="inputEmail"
            id="inputEmail"
            placeholder="&nbsp;exemple@gmail.com"
          />
        </div>
        <div class="divLogin">
          <label for="inputMdp">Mot de passe :</label>
          <input
            v-model="login.password"
            type="password"
            name="inputMdp"
            id="inputMdp"
            placeholder="&nbsp;********"
          />
        </div>
        <div v-if="errorMessage">
          <span style="color: red">{{ errorMessage }}</span>
        </div>
        <p><a href="/SignIn/passwordForget">Mot de passe oublié ?</a></p>

        <div id="inscri_apply">
          <p>Vous n'avez pas de compte ? <a href="/SignUp/">Inscription !</a></p>
          <p>Vous êtes une Société ? <a href="/SignIn/AddCompany/">Rejoignez-nous !</a></p>
          <br />
        </div>
        <button type="submit" id="sign_in">Se connecter !</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* -------------------
   FOND ET CONTENEUR GLOBAL
   ------------------- */

.background-logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  opacity: 0.08;
  z-index: 1;
  pointer-events: none;
}

#containerFirst {
  /* Bleu principal: #007bff */
  /* Couleur de fond: #f4f6f9 */
  /* Couleur de texte sombre: #212529 */
  /* Ombre: 0 10px 25px rgba(0, 0, 0, 0.15) */
  /* Bordure input: #ced4da */
  /* Erreur: #dc3545 */

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f6f9;
  padding: 80px;
  box-sizing: border-box;
  z-index: 2;
  position: relative;
}

/* -------------------
   CARTE DE CONNEXION
   ------------------- */

#containerSecond {
  background-color: #ffffff;
  padding: 30px;
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;
  margin: 0;
  z-index: 10;
}

.h1Login {
  text-align: center;
  font-size: 2.2rem;
  color: #212529;
  font-weight: 700;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* -------------------
   FORMULAIRE ET CHAMPS
   ------------------- */

#loginForm {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.divLogin {
  display: flex;
  flex-direction: column;
}

.divLogin label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #212529;
  font-size: 0.95rem;
}

.divLogin input {
  padding: 12px 10px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.divLogin input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  outline: none;
}

/* Message d'erreur */
div[v-if='errorMessage'] span {
  display: block;
  margin-top: 10px;
  padding: 8px 10px;
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545 !important;
  border-radius: 5px;
  font-weight: 500;
  text-align: center;
}

/* Liens génériques */
p {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #212529;
  text-align: right;
}

a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

a:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* Liens inscription / société */
#inscri_apply {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

#inscri_apply p {
  text-align: center;
  margin: 5px 0;
}

/* -------------------
   BOUTON
   ------------------- */

#sign_in {
  padding: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.1s;
  border: none;
  border-radius: 10px;
  width: 100%;
  color: white;
  background-color: #007bff;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
  margin-top: 15px;
}

#sign_in:hover {
  background-color: #0056b3;
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
  transform: translateY(-1px);
}

/* ========================================
   📱 RESPONSIVE DESIGN COMPLET
   ======================================== */

/* Tablettes et écrans moyens (max 1024px) */
@media (max-width: 1024px) {
  #containerFirst {
    padding: 60px 40px;
  }

  #containerSecond {
    max-width: 400px;
  }
}

/* Tablettes portrait (max 768px) */
@media (max-width: 768px) {
  #containerFirst {
    padding: 40px 30px;
  }

  #containerSecond {
    max-width: 90%;
    padding: 28px 25px;
  }

  .h1Login {
    font-size: 2rem;
    margin-bottom: 22px;
  }

  .divLogin label {
    font-size: 0.9rem;
  }

  .divLogin input {
    padding: 11px 10px;
    font-size: 0.95rem;
  }

  #sign_in {
    font-size: 1.05rem;
    padding: 11px;
  }

  p {
    font-size: 0.85rem;
  }

  #inscri_apply {
    font-size: 0.85rem;
    margin-top: 18px;
  }
}

/* Mobile (max 550px) */
@media (max-width: 550px) {
  #containerFirst {
    padding: 30px 20px;
  }

  #containerSecond {
    padding: 25px 20px;
    max-width: 90%;
    border-radius: 12px;
  }

  .h1Login {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  #loginForm {
    gap: 12px;
  }

  .divLogin label {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

  .divLogin input {
    font-size: 0.9rem;
    padding: 10px 9px;
  }

  #sign_in {
    font-size: 1rem;
    padding: 10px;
    margin-top: 12px;
  }

  p {
    font-size: 0.8rem;
  }

  #inscri_apply {
    font-size: 0.8rem;
    margin-top: 15px;
  }

  div[v-if='errorMessage'] span {
    font-size: 0.85rem;
    padding: 7px 9px;
  }
}

/* Petits mobiles (max 400px) */
@media (max-width: 400px) {
  #containerFirst {
    padding: 25px 15px;
  }

  #containerSecond {
    padding: 22px 18px;
    max-width: 95%;
    border-radius: 10px;
  }

  .h1Login {
    font-size: 1.6rem;
    margin-bottom: 18px;
  }

  #loginForm {
    gap: 10px;
  }

  .divLogin label {
    font-size: 0.8rem;
  }

  .divLogin input {
    font-size: 0.85rem;
    padding: 9px 8px;
    border-radius: 6px;
  }

  #sign_in {
    font-size: 0.95rem;
    padding: 9px;
    border-radius: 8px;
  }

  p {
    font-size: 0.75rem;
  }

  #inscri_apply {
    font-size: 0.75rem;
    margin-top: 12px;
  }

  a {
    font-weight: 500;
  }
}

/* Très petits mobiles (max 360px) */
@media (max-width: 360px) {
  #containerFirst {
    padding: 40px 25px;
  }

  #containerSecond {
    padding: 20px 15px;
    max-width: 96%;
  }

  .h1Login {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  #loginForm {
    gap: 9px;
  }

  .divLogin label {
    font-size: 0.75rem;
  }

  .divLogin input {
    font-size: 0.8rem;
    padding: 8px 7px;
  }

  #sign_in {
    font-size: 0.9rem;
    padding: 8px;
    margin-top: 10px;
  }

  p {
    font-size: 0.7rem;
  }

  #inscri_apply {
    font-size: 0.7rem;
    margin-top: 10px;
  }

  div[v-if='errorMessage'] span {
    font-size: 0.8rem;
    padding: 6px 8px;
  }
}

/* Orientation paysage mobile */
@media (max-height: 600px) and (orientation: landscape) {
  #containerFirst {
    padding: 20px 15px;
    min-height: auto;
  }

  #containerSecond {
    max-width: 450px;
    padding: 20px;
  }

  .h1Login {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }

  #loginForm {
    gap: 10px;
  }

  .divLogin input {
    padding: 9px 8px;
  }

  #sign_in {
    padding: 9px;
    margin-top: 10px;
  }

  #inscri_apply {
    margin-top: 12px;
  }
}

/* Écrans très larges (min 1400px) */
@media (min-width: 1400px) {
  #containerFirst {
    padding: 100px;
  }

  #containerSecond {
    max-width: 480px;
    padding: 40px 35px;
  }

  .h1Login {
    font-size: 2.4rem;
    margin-bottom: 30px;
  }

  .divLogin label {
    font-size: 1rem;
  }

  .divLogin input {
    padding: 14px 12px;
    font-size: 1.05rem;
  }

  #sign_in {
    font-size: 1.15rem;
    padding: 14px;
  }
}

/* Désactivation des effets hover sur tactile */
@media (hover: none) and (pointer: coarse) {
  #sign_in:hover {
    background-color: #007bff;
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
    transform: none;
  }

  a:hover {
    text-decoration: none;
  }
}

/* Amélioration accessibilité pour réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }

  #sign_in:hover {
    transform: none;
  }
}
</style>
