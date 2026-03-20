<script setup>
import { ref, defineProps } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// --- CONFIGURATION API ---
const apiUrl = import.meta.env.VITE_API_URL

const router = useRouter()

// --- Récupération de l'ID passé dans l'URL via Vue Router ---
const props = defineProps({
  offerId: {
    type: Number,
    required: true,
  },
})

// --- État du composant ---
const motivation = ref('')
const isApplied = ref(false)
const loading = ref(false)
const message = ref('')
const authToken = ref(localStorage.getItem('auth_token'))

// --- Fonction d'envoi de candidature ---
const applyToOffer = async () => {
  loading.value = true
  message.value = ''

  // FormData envoyé au backend Laravel
  const formData = new FormData()
  formData.append('offer_id', props.offerId)
  formData.append('motivation_text', motivation.value)

  try {
    // Utilisation de apiUrl au lieu de import.meta.env direct
    const response = await axios.post(`${apiUrl}/api/apply-offer`, formData, {
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    // Succès
    message.value = '✅ ' + response.data.message
    isApplied.value = true
    motivation.value = ''

    setTimeout(() => {
      router.back()
    }, 1500)
  } catch (error) {
    isApplied.value = false

    if (error.response) {
      if (error.response.status === 409) {
        message.value = '⚠️ ' + error.response.data.message
        isApplied.value = true
      } else if (error.response.data.errors) {
        message.value = '❌ Erreur de validation: Le champ motivation est obligatoire.'
      } else {
        message.value = '❌ Échec de la candidature. Erreur serveur.'
      }
    } else {
      message.value = '❌ Erreur réseau. Impossible de contacter le serveur.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="apply-container">
    <h1 class="apply-title">POSTULER MAINTENANT !</h1>

    <form @submit.prevent="applyToOffer" class="apply-form">
      <div class="motivation-field">
        <label for="inputMotivation" class="field-label">MOTIVATION :</label>
        <p style="font-size: 12px; font-family: inherit; color: green">
          (Votre CV et vos informations personnelles sont <br />
          déjà importés depuis votre profil !)
        </p>

        <textarea
          v-model="motivation"
          rows="6"
          placeholder="Décrivez votre motivation"
          class="textarea"
          id="inputMotivation"
          required
        ></textarea>

        <button type="submit" class="send-btn" :disabled="loading || isApplied">
          {{ loading ? 'Envoi...' : isApplied ? 'Déjà postulé' : 'Envoyer' }}
        </button>

        <p v-if="message" class="status-message">{{ message }}</p>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Conteneur principal */
.apply-container {
  max-width: 800px;
  margin: 3.5% auto;
  padding: 40px 20px;
}

/* Titre principal */
.apply-title {
  text-align: center;
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 40px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Formulaire */
.apply-form {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Champ motivation */
.motivation-field {
  display: flex;
  flex-direction: column;
}

/* Labels */
.field-label {
  font-weight: 700;
  color: black;
  margin-bottom: 10px;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Textarea */
.textarea {
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  font-family: Arial, sans-serif;
  resize: vertical;
  min-height: 150px;
  transition: all 0.3s ease;
}

.textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.textarea::placeholder {
  color: #999;
  font-style: italic;
}

/* Bouton d'envoi */
.send-btn {
  background: linear-gradient(45deg, #606af1, #20c997);
  color: white;
  padding: 15px 40px;
  border: none;
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 5px;
  align-self: center;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  margin-top: 2%;
}

.send-btn:hover {
  background: linear-gradient(45deg, #50d9eb, #05198a);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.send-btn:active {
  transform: translateY(0);
}

/* responsive fait par chat gpt car je ne connais et comprends pas */

@media (max-width: 768px) {
  .apply-container {
    padding: 20px 10px; /* réduit les marges internes */
  }

  .apply-title {
    font-size: 1.8rem; /* titre plus petit sur mobile */
    margin-bottom: 20px;
  }

  .apply-form {
    gap: 20px; /* réduit les espaces */
    padding: 20px;
  }

  .send-btn {
    width: 100%; /* bouton prend toute la largeur */
    font-size: 1rem;
    padding: 12px 0;
  }
}
</style>
