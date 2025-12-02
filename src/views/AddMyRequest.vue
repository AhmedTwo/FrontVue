<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false) // Indique que le processus (l'envoi de la demande) a commencé
const error = ref(null) // Réinitialise l'état d'erreur
const success = ref(false) // Réinitialise l'état de succès

const requestData = ref({
  title: '',
  type: '',
  description: '',
})

//  fonction d'ajout (POST)
const addRequest = async () => {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    error.value = "Erreur d'authentification. Token manquant."
    return
  }

  // Assurez-vous que les clés ci-dessous correspondent aux attentes de votre API
  const payload = {
    title: requestData.value.title,
    type: requestData.value.type,
    description: requestData.value.description,
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/addRequest', payload, {
      // Le Payload est le corps de données que j'envoie (par exemple, le JSON de l'offre) au serveur pour qu'il puisse créer la ressource
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    success.value = true
    console.log('Demande ajoutée:', response.data)

    // redirection après succès
    setTimeout(() => {
      router.push('/MyRequest/')
    }, 1000)
  } catch (err) {
    console.error("Erreur lors de l'ajout de la demande :", err.response?.data || err)
    //  erreur retournée par le serveur si elle existe
    error.value = err.response?.data?.message || "Échec de l'ajout. Vérifiez les champs."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="add-request-container">
    <!-- En-tête -->
    <div class="header-section">
      <h1>AJOUT D'UNE DEMANDE</h1>
      <p class="subtitle">Créez une nouvelle demande en remplissant les champs ci-dessous</p>
    </div>

    <form id="requestForm" @submit.prevent="addRequest" class="request-form" novalidate>
      <div class="form-group">
        <label for="inputTitre">TITRE</label>
        <input
          type="text"
          id="inputTitre"
          v-model="requestData.title"
          placeholder="Entrez le titre de la demande"
          required
        />
      </div>

      <div class="form-group">
        <label for="inputType">TYPE</label>
        <select id="inputType" v-model="requestData.type" required>
          <option value="">-- Sélectionnez un type --</option>
          <option value="RECLAMATION">RECLAMATION</option>
          <option value="DEMANDES">DEMANDES D'INFORMATION</option>
          <option value="SUPPRESSION">SUPPRESSION</option>
          <option value="MODIFICATION">MODIFICATION</option>
        </select>
      </div>

      <div class="form-group">
        <label for="inputDescription">DESCRIPTION</label>
        <textarea
          id="inputDescription"
          v-model="requestData.description"
          rows="6"
          placeholder="Décrivez votre demande ici..."
          required
        ></textarea>
      </div>

      <div v-if="error" class="divAdd message error-message">❌ {{ error }}</div>
      <div v-if="success" class="divAdd message success-message">
        ✅ Demande ajoutée avec succès !
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading">Ajout en cours...</span>
          <span v-else>Ajouter la demande</span>
        </button>
        <a href="/myRequest" class="btn-cancel">ANNULER</a>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-request-container {
  max-width: 800px;
  margin: 60px auto;
  background: #fff;
  padding: 35px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* En-tête */
.header-section {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #000;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  margin-top: 6px;
}

/* Formulaire */
.request-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

input,
select,
textarea {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 1rem;
  transition:
    border 0.3s ease,
    box-shadow 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #0066ff;
  outline: none;
  box-shadow: 0 0 6px rgba(0, 102, 255, 0.3);
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn-submit {
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 102, 255, 0.4);
}

.btn-submit:hover {
  background: #0052cc;
  transform: translateY(-2px);
}

.btn-cancel {
  background: white;
  color: #666;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #f5f5f5;
  color: black;
}

/* Responsive */
@media (max-width: 768px) {
  .add-request-container {
    padding: 25px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
    text-align: center;
  }
}
</style>
