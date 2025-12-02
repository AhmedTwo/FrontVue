<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const requestId = route.params.id
const isLoading = ref(true)

// liste officielle des types de demandes (basée sur ton ENUM)
const types = ['RECLAMATION', 'DEMANDES', 'SUPPRESSION', 'MODIFICATION']

const request = ref({
  type: '',
  title: '',
  description: '',
})

const loadRequest = async () => {
  const token = localStorage.getItem('auth_token')

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/requestById/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Détecte automatiquement si les données sont dans "data" ou pas
    const data = response.data.data ? response.data.data : response.data

    request.value.type = data.type
    request.value.title = data.title
    request.value.description = data.description

    console.log(data)
    console.log(request)
  } catch (error) {
    console.error('Erreur lors du chargement de la demande :', error)
    alert('Impossible de charger la demande à modifier.')
  } finally {
    isLoading.value = false
  }
}

// Màj de la demande
const updateRequest = async () => {
  const token = localStorage.getItem('auth_token')

  try {
    await axios.post(
      `http://127.0.0.1:8000/api/requestUpdate/${requestId}`,
      {
        type: request.value.type,
        title: request.value.title,
        description: request.value.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    alert('✅ Demande mise à jour avec succès')
    router.push('/MyRequest')
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error)
    alert('❌ Erreur lors de la mise à jour de la demande.')
  }
}

onMounted(loadRequest)
</script>

<template>
  <div class="update-container">
    <div class="header-section">
      <h1>MODIFIER MA DEMANDE</h1>
      <p class="subtitle">Mettez à jour les informations de votre demande</p>
    </div>

    <div v-if="isLoading" style="text-align: center; padding: 40px">Chargement...</div>

    <form v-else class="update-form" @submit.prevent="updateRequest">
      <div class="form-group">
        <label for="title">Titre</label>
        <input type="text" id="title" v-model="request.title" required />
      </div>

      <div class="form-group">
        <label for="type">Type de demande</label>
        <select id="type" v-model="request.type" required>
          <option v-for="t in types" :key="t" :value="t">
            {{ t }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" rows="5" v-model="request.description" required></textarea>
      </div>

      <div class="action-buttons">
        <button type="submit" class="btn-save">Enregistrer les modifications</button>
        <a href="/MyRequest" class="btn-cancel">Annuler</a>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* ton CSS reste inchangé */
.update-container {
  max-width: 800px;
  margin: 50px auto;
  background: white;
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: black;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.update-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-weight: 600;
  color: #333;
}

input,
select,
textarea {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 1rem;
  transition: border 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #0066ff;
  outline: none;
  box-shadow: 0 0 4px rgba(0, 102, 255, 0.3);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn-save {
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 102, 255, 0.4);
}

.btn-save:hover {
  background: #0052cc;
  transform: translateY(-2px);
}

.btn-cancel {
  background: white;
  color: #666;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 12px 24px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #f5f5f5;
  color: black;
}
</style>
