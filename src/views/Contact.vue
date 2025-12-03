<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const submissionStatus = ref('') // 'success', 'error', 'sending'
const errorMessage = ref('')

const submitForm = async () => {
  submissionStatus.value = 'sending'
  errorMessage.value = ''

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/contact', form.value)

    submissionStatus.value = 'success'
    errorMessage.value = response.data.message // Récupère le message de succès de Laravel

    // Réinitialiser le formulaire après succès
    form.value.name = ''
    form.value.email = ''
    form.value.subject = ''
    form.value.message = ''
  } catch (error) {
    submissionStatus.value = 'error'

    if (error.response && error.response.data.errors) {
      // Erreurs de validation de Laravel
      errorMessage.value = 'Veuillez corriger les champs invalides.'
      // Vous pourriez itérer sur error.response.data.errors pour afficher les messages spécifiques sous les champs
    } else if (error.response && error.response.data.error) {
      // Erreur PHPMailer retournée par le contrôleur (code 500)
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = 'Erreur réseau ou serveur inattendue.'
    }
    console.error('Erreur de soumission:', error)
  }
}
</script>

<template>
  <main class="page-container compact">
    <div class="content-wrapper">
      <div class="contact-card-pure">
        <h1 class="main-title compact-title">Contactez-nous 💬</h1>

        <div class="contact-content-flex">
          <div class="contact-info-panel">
            <h2 class="section-title compact-section-title">Nos Informations</h2>

            <div class="contact-grid">
              <div class="info-item-pure compact-info">
                <svg
                  class="icon icon-success compact-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19.646.646.547-2.19A.677.677 0 0 1 8.208 4.7l.142.142c-.012.384-.043.79-.113 1.185-.163.92-.377 1.98-.778 2.978A15.39 15.39 0 0 1 4.545 14H.455c-.21 0-.39-.144-.455-.35L.379 13.1c.075-.245.289-.544.595-.913l3.6-4.72a.678.678 0 0 0-.214-.216L.884 9.535a.677.677 0 0 1-.363-.63l-.545-2.18c-.065-.206.115-.411.325-.411h11.23a.678.678 0 0 1 .59.35l.645 1.942.296-.296.646-.646c.52-.13.79-.68.647-1.298l-.41-1.643a1.745 1.745 0 0 1 .163-2.61l2.308-2.308a1.745 1.745 0 0 1 2.61-.163l1.76 1.32c.52.39.75.92.68 1.48l-.337 1.347a.677.677 0 0 1-.223.364l-3.32 3.32a.678.678 0 0 0-.158.552l.214 1.495.214 1.495a.678.678 0 0 1-.35.592l-1.942.645A15.42 15.42 0 0 1 4.545 14H.455c-.21 0-.39-.144-.455-.35L.379 13.1c.075-.245.289-.544.595-.913l3.6-4.72a.678.678 0 0 0-.214-.216L.884 9.535a.677.677 0 0 1-.363-.63l-.545-2.18c-.065-.206.115-.411.325-.411h11.23a.678.678 0 0 1 .59.35l.645 1.942.296-.296.646-.646c.52-.13.79-.68.647-1.298l-.41-1.643a1.745 1.745 0 0 1 .163-2.61l2.308-2.308a1.745 1.745 0 0 1 2.61-.163l1.76 1.32c.52.39.75.92.68 1.48l-.337 1.347a.677.677 0 0 1-.223.364l-3.32 3.32a.678.678 0 0 0-.158.552l.214 1.495.214 1.495a.678.678 0 0 1-.35.592l-1.942.645z"
                  />
                </svg>
                <div>
                  <h5 class="info-title compact-info-title">Téléphone</h5>
                  <p class="info-text compact-info-text">+33 1 23 45 67 89</p>
                </div>
              </div>

              <div class="info-item-pure compact-info">
                <svg
                  class="icon icon-danger compact-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.417L8 9.583l-1.326-.798-5.64 3.417A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.89L1 5.383v5.722Z"
                  />
                </svg>
                <div>
                  <h5 class="info-title compact-info-title">Email</h5>
                  <p class="info-text compact-info-text">seghiriahmed9@gmail.com</p>
                </div>
              </div>

              <div class="info-item-pure compact-info">
                <svg
                  class="icon icon-warning compact-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"
                  />
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                </svg>
                <div>
                  <h5 class="info-title compact-info-title">Horaires</h5>
                  <p class="info-text compact-info-text">Lun. - Ven.: 9h-18h / Samedi: 10h-14h</p>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-form-panel">
            <h2 class="section-title compact-section-title">Un message pour Portal_Job ?</h2>

            <div v-if="submissionStatus === 'sending'" class="alert alert-info">
              Envoi du message en cours...
            </div>
            <div v-else-if="submissionStatus === 'success'" class="alert alert-success">
              ✅ **Succès :** {{ errorMessage }}
            </div>
            <div v-else-if="submissionStatus === 'error'" class="alert alert-danger">
              ❌ **Erreur :** {{ errorMessage }}
            </div>

            <form @submit.prevent="submitForm" class="contact-form compact-form">
              <div class="form-group full-width compact-form-group">
                <label for="name">Nom :</label>
                <input type="text" id="name" v-model="form.name" required />
              </div>

              <div class="form-group full-width compact-form-group">
                <label for="email">Email :</label>
                <input type="email" id="email" v-model="form.email" required />
              </div>

              <div class="form-group full-width compact-form-group">
                <label for="subject">Sujet :</label>
                <input type="text" id="subject" v-model="form.subject" required />
              </div>

              <div class="form-group full-width compact-form-group">
                <label for="message">Message :</label>
                <textarea id="message" rows="3" v-model="form.message" required></textarea>
              </div>

              <div class="form-group full-width submit-group compact-submit-group">
                <button
                  type="submit"
                  class="submit-button compact-button"
                  :disabled="submissionStatus === 'sending'"
                >
                  {{ submissionStatus === 'sending' ? 'Envoi...' : 'Envoyer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* -------------------
   STRUCTURE GÉNÉRALE
   ------------------- */

.page-container {
  font-family:
    'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
    sans-serif;
  padding: 70px 0;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1000px;
  padding: 0 10px;
}

/* -------------------
   CARTE DE CONTACT & TITRES
   ------------------- */

.contact-card-pure {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.main-title {
  text-align: center;
  font-size: 2.2rem;
  color: #0d6efd;
  font-weight: bold;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #0d6efd;
}

.section-title {
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 20px;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
}

/* -------------------
   DISPOSITION CÔTE À CÔTE (FLEXBOX)
   ------------------- */

.contact-content-flex {
  display: flex;
  gap: 30px;
}

.contact-info-panel {
  flex: 1;
  min-width: 250px;
}

.contact-form-panel {
  flex: 1.5;
}

/* -------------------
   GRILLE D'INFORMATIONS (Coordonnées)
   ------------------- */

.contact-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item-pure {
  display: flex;
  align-items: center;
  background-color: #e9ecef;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.icon {
  font-size: 2rem;
  margin-right: 15px;
  min-width: 40px;
}

.info-title {
  font-weight: bold;
  margin-bottom: 3px;
  font-size: 1rem; /* Réduction de la taille du titre d'info */
}

.info-text {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem; /* Réduction de la taille du texte d'info */
}

/* -------------------
   FORMULAIRE DE CONTACT
   ------------------- */

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Réduction de l'espace entre les champs */
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

label {
  margin-bottom: 5px;
  font-weight: 600;
  color: #343a40;
  font-size: 0.95rem;
}

input,
textarea {
  padding: 10px; /* Réduction du padding des inputs */
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 0.95rem;
}

textarea {
  resize: vertical;
}

.submit-group {
  margin-top: 15px;
}

.submit-button {
  background-color: #0d6efd;
  color: white;
  padding: 10px 20px; /* Réduction du padding du bouton */
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
}

/* -------------------
   COULEURS DES ICÔNES & HOVERS
   ------------------- */
.contact-card-pure:hover {
  transform: none;
} /* Suppression de l'effet de survol pour la compacité */
.icon-success {
  color: #198754;
}
.icon-danger {
  color: #dc3545;
}
.icon-warning {
  color: #ffc107;
}
.submit-button:hover {
  background-color: #0b5ed7;
}
input:focus,
textarea:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.2);
}

/* Styles pour les alertes de statut */
.alert {
  padding: 10px 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid transparent;
}

.alert-info {
  color: #055160;
  background-color: #cff4fc;
  border-color: #b6effb;
}

.alert-success {
  color: #0f5132;
  background-color: #d1e7dd;
  border-color: #badbcc;
}

.alert-danger {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
}

/* -------------------
   RESPONSIVE PURE CSS
   ------------------- */

@media (max-width: 992px) {
  .contact-content-flex {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .contact-card-pure {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .info-item-pure {
    flex-direction: column;
    text-align: center;
  }
  .icon {
    margin: 0 0 8px 0;
  }
}
</style>
