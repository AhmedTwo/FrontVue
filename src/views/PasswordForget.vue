<script setup>
import ImagesPortal from '../assets/images/Portal.png'

import { ref } from 'vue' // Nécessaire pour les variables réactives
import axios from 'axios' // Nécessaire pour les requêtes API
// Importation de la fonction de navigation pour changer de page après soumission
import { useRouter } from 'vue-router'

// on initialise routeur Vue pour la redirection
const router = useRouter()

const inputEmail = ref('') // pour lier l'input
const errorMessage = ref('') // pour le message d'erreur
const successMessage = ref('') // pour le message de succès
const isLoading = ref(false) // Pour désactiver le bouton pendant l'envoi

const submitForgetPassword = async () => {
  // Réinitialisation
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  if (!inputEmail.value) {
    errorMessage.value = 'Veuillez entrer une adresse e-mail.'
    isLoading.value = false
    return
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/send-identifiants', {
      user_login_email: inputEmail.value, // Nom de champ attendu par Laravel
    })

    if (response.data.success) {
      successMessage.value = response.data.message
    }

    setTimeout(() => {
      // Démarre un délai
      // Redirection après succès (vers la page de connexion)
      router.push('/SignIn')
    }, 2000) // 1 seconde de délai
  } catch (error) {
    console.error('Erreur de soumission:', error)
    if (error.response && error.response.status === 422) {
      errorMessage.value = 'Veuillez entrer une adresse e-mail valide.'
    } else {
      errorMessage.value = 'Erreur lors de la tentative de réinitialisation. Veuillez réessayer.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div id="containerFirst">
    <div id="containerSecond">
      <h1 class="h1Forget">
        Mot de passe oublié &nbsp;&nbsp;
        <img :src="ImagesPortal" alt="fond logo porte de portal job" width="35" />
      </h1>

      <p>
        Entrez votre <span class="spanEmail">adresse mail</span> pour recevoir un
        <span class="spanNewPassword">nouveau mot de passe</span> sur votre boite mail :
      </p>

      <div v-if="errorMessage" id="errorMessage">{{ errorMessage }}</div>
      <div v-if="successMessage" id="successMessage">{{ successMessage }}</div>

      <form @submit.prevent="submitForgetPassword" id="loginForm">
        <div class="divLogin">
          <label for="inputEmail">Adresse email :</label><br />
          <input
            type="email"
            id="inputEmail"
            name="inputEmail"
            placeholder="&nbsp;exemple@gmail.com"
            required
            v-model="inputEmail"
          /><br /><br />
        </div>
        <button type="submit" class="sendButton" :disabled="isLoading">
          {{ isLoading ? 'Envoi en cours...' : 'Envoi du nouveau mot de passe' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* COULEURS UTILES */
/* Bleu principal: #007bff */
/* Couleur de fond: #f4f6f9 */
/* Couleur de texte sombre: #212529 */
/* Ombre: 0 10px 25px rgba(0, 0, 0, 0.15) */
/* Bordure input: #ced4da */
/* Erreur: #dc3545 (Rouge) */
/* Succès: #198754 (Vert) */

/* -------------------
   CONTENEUR GLOBAL
   ------------------- */

#containerFirst {
  /* Assure un centrage vertical sur toute la page */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f6f9; /* Fond clair */
  padding: 80px;
  box-sizing: border-box;
}

/* -------------------
   CARTE DU FORMULAIRE
   ------------------- */

#containerSecond {
  background-color: #ffffff;
  padding: 30px; /* Padding généreux */
  border: none;
  border-radius: 15px; /* Coins arrondis */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); /* Ombre douce */
  width: 100%;
  max-width: 420px; /* Largeur fixe */
  margin: 0; /* Annule le margin-top du HTML pour un centrage propre */
}

/* Titre */
.h1Forget {
  text-align: center;
  font-size: 2.2rem;
  color: #212529; /* Texte sombre */
  font-weight: 700;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 15px;
}

/* Texte d'explication */
p {
  text-align: center;
  margin-bottom: 20px;
  color: #495057;
  line-height: 1.5;
}

/* Mise en évidence dans le paragraphe */
.spanNewPassword {
  color: #dc3545; /* Remplacé par un rouge */
  font-weight: 700;
}

.spanEmail {
  color: #212529; /* Remplacé par un noir/gris foncé */
  font-weight: 700;
}

/* Messages (Erreur/Succès) */
#errorMessage {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545 !important;
  border-radius: 5px;
  font-weight: 500;
  margin-bottom: 15px;
  padding: 10px;
  text-align: center;
}

#successMessage {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754 !important;
  border-radius: 5px;
  font-weight: 500;
  margin-bottom: 15px;
  padding: 10px;
  text-align: center;
}

/* -------------------
   FORMULAIRE ET INPUT
   ------------------- */

#loginForm {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espacement entre le champ et le bouton */
}

.divLogin {
  display: flex;
  flex-direction: column;
}

.divLogin label {
  font-weight: 600;
  color: #212529;
  margin-bottom: 8px;
  font-size: 1rem;
}

.divLogin input {
  padding: 12px 10px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  width: 100%; /* Assure que l'input prend toute la largeur */
  box-sizing: border-box;
}

.divLogin input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  outline: none;
}

/* -------------------
   BOUTON
   ------------------- */

.sendButton {
  padding: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.1s;
  border: none; /* Suppression de la bordure du HTML */
  border-radius: 10px;
  width: 100%;
  color: white; /* Texte blanc */
  background-color: #007bff; /* Fond bleu */
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
}

.sendButton:hover {
  background-color: #0056b3; /* Bleu foncé au survol */
  color: white; /* Conserver le blanc */
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

  .h1Forget {
    font-size: 2rem;
    margin-bottom: 22px;
    padding-bottom: 12px;
  }

  p {
    margin-bottom: 18px;
    font-size: 0.95rem;
  }

  .divLogin label {
    font-size: 0.95rem;
    margin-bottom: 7px;
  }

  .divLogin input {
    padding: 11px 10px;
    font-size: 0.95rem;
  }

  #loginForm {
    gap: 18px;
  }

  .sendButton {
    font-size: 1.05rem;
    padding: 11px;
  }

  #errorMessage,
  #successMessage {
    font-size: 0.9rem;
    padding: 9px;
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

  .h1Forget {
    font-size: 1.8rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom-width: 1.5px;
  }

  p {
    margin-bottom: 16px;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .divLogin label {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }

  .divLogin input {
    font-size: 0.9rem;
    padding: 10px;
    border-radius: 7px;
  }

  #loginForm {
    gap: 16px;
  }

  .sendButton {
    font-size: 1rem;
    padding: 10px;
    border-radius: 9px;
  }

  #errorMessage,
  #successMessage {
    font-size: 0.85rem;
    padding: 8px;
    margin-bottom: 12px;
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

  .h1Forget {
    font-size: 1.6rem;
    margin-bottom: 18px;
    padding-bottom: 9px;
  }

  p {
    margin-bottom: 14px;
    font-size: 0.85rem;
  }

  .divLogin label {
    font-size: 0.85rem;
    margin-bottom: 5px;
  }

  .divLogin input {
    font-size: 0.85rem;
    padding: 9px 8px;
    border-radius: 6px;
  }

  #loginForm {
    gap: 14px;
  }

  .sendButton {
    font-size: 0.95rem;
    padding: 9px;
    border-radius: 8px;
  }

  #errorMessage,
  #successMessage {
    font-size: 0.8rem;
    padding: 7px;
    margin-bottom: 10px;
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

  .h1Forget {
    font-size: 1.5rem;
    margin-bottom: 15px;
    padding-bottom: 8px;
  }

  p {
    margin-bottom: 12px;
    font-size: 0.8rem;
  }

  .divLogin label {
    font-size: 0.8rem;
  }

  .divLogin input {
    font-size: 0.8rem;
    padding: 8px 7px;
  }

  #loginForm {
    gap: 12px;
  }

  .sendButton {
    font-size: 0.9rem;
    padding: 8px;
  }

  #errorMessage,
  #successMessage {
    font-size: 0.75rem;
    padding: 6px;
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

  .h1Forget {
    font-size: 1.6rem;
    margin-bottom: 15px;
    padding-bottom: 8px;
  }

  p {
    margin-bottom: 12px;
    font-size: 0.85rem;
  }

  #loginForm {
    gap: 12px;
  }

  .divLogin input {
    padding: 9px 8px;
  }

  .sendButton {
    padding: 9px;
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

  .h1Forget {
    font-size: 2.4rem;
    margin-bottom: 30px;
    padding-bottom: 18px;
  }

  p {
    margin-bottom: 25px;
    font-size: 1.05rem;
    line-height: 1.6;
  }

  .divLogin label {
    font-size: 1.05rem;
    margin-bottom: 10px;
  }

  .divLogin input {
    padding: 14px 12px;
    font-size: 1.05rem;
  }

  #loginForm {
    gap: 25px;
  }

  .sendButton {
    font-size: 1.15rem;
    padding: 14px;
  }

  #errorMessage,
  #successMessage {
    font-size: 1rem;
    padding: 12px;
    margin-bottom: 18px;
  }
}

/* Désactivation des effets hover sur tactile */
@media (hover: none) and (pointer: coarse) {
  .sendButton:hover {
    background-color: #007bff;
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
    transform: none;
  }
}

/* Amélioration accessibilité pour réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }

  .sendButton:hover {
    transform: none;
  }
}
</style>
