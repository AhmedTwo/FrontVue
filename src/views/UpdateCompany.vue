<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

// --- CONFIGURATION API ---
const apiUrl = import.meta.env.VITE_API_URL

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const message = ref({
  text: null,
  type: '',
})

const companyId = userStore.user.company_id
const isLoading = ref(true)
const token = localStorage.getItem('auth_token')
const newLogoFile = ref(null)

const company = ref({
  name: '',
  logo: '',
  number_of_employees: '',
  industry: '',
  address: '',
  description: '',
  email_company: '',
  n_siret: '',
})

const handleLogoChange = (event) => {
  const file = event.target.files[0]
  newLogoFile.value = file
}

const loadCompany = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/companyById/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = response.data.data ? response.data.data : response.data

    company.value.name = data.name
    company.value.logo = data.logo
    company.value.number_of_employees = data.number_of_employees
    company.value.industry = data.industry
    company.value.address = data.address
    company.value.description = data.description
    company.value.email_company = data.email_company
    company.value.n_siret = data.n_siret
  } catch (error) {
    console.error('Erreur lors du chargement de la société :', error)
    message.value.text = 'Impossible de charger la société.'
    message.value.type = 'error'
  } finally {
    isLoading.value = false
  }
}

const updateCompany = async () => {
  const formData = new FormData()
  message.value.text = null

  formData.append('name', company.value.name)
  formData.append('number_of_employees', company.value.number_of_employees ?? '')
  formData.append('industry', company.value.industry)
  formData.append('address', company.value.address)
  formData.append('description', company.value.description)
  formData.append('email_company', company.value.email_company)
  formData.append('n_siret', company.value.n_siret ? String(company.value.n_siret) : '')

  if (newLogoFile.value) {
    formData.append('logo', newLogoFile.value)
  }

  try {
    await axios.post(`${apiUrl}/api/companyUpdate/${companyId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    message.value.text = '✅ Société mise à jour avec succès'
    message.value.type = 'success'

    setTimeout(() => {
      router.back()
    }, 1500)
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error)
    message.value.text = '❌ Erreur lors de la mise à jour.'
    message.value.type = 'error'
  }
}

const validateSiret = () => {
  if (company.value.n_siret && company.value.n_siret.length !== 14) {
    message.value.text = '⚠️ Le SIRET doit comporter 14 chiffres.'
    message.value.type = 'error'
  } else {
    message.value.text = ''
  }
}

onMounted(loadCompany)
</script>

<template>
  <main class="update-container">
    <div class="update-header">
      <h1 class="update-title">MODIFIER LA SOCIÉTÉ</h1>
    </div>

    <div v-if="isLoading" class="loading-state">Chargement...</div>

    <div v-if="message.text" :class="['alert', message.type]">
      {{ message.text }}
    </div>

    <form class="update-form" @submit.prevent="updateCompany" v-if="!isLoading">
      <div class="form-group">
        <label for="inputNom" class="form-label">Nom</label>
        <input type="text" id="inputNom" v-model="company.name" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="inputNbEmploye" class="form-label">Nombre d’employés</label>
        <input
          type="number"
          id="inputNbEmploye"
          v-model.number="company.number_of_employees"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="inputDomaine" class="form-label">Domaine</label>
        <input
          type="text"
          id="inputDomaine"
          v-model="company.industry"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="inputAdresse" class="form-label">Adresse</label>
        <input
          type="text"
          id="inputAdresse"
          v-model="company.address"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="inputDescription" class="form-label">Description</label>
        <textarea
          id="inputDescription"
          v-model="company.description"
          class="form-textarea"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="inputEmail" class="form-label">Email de contact</label>
        <input
          type="email"
          id="inputEmail"
          v-model="company.email_company"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="inputSiret" class="form-label">Numéro SIRET</label>
        <input type="text" v-model="company.n_siret" @blur="validateSiret" class="form-input" />
      </div>

      <div class="form-group">
        <label for="inputLogo" class="form-label">Logo</label>

        <div v-if="company.logo" class="current-logo-display">
          <p>Logo actuel :</p>
          <img
            :src="apiUrl + '/storage/' + company.logo"
            alt="Logo actuel"
            class="company-logo-preview"
          />
        </div>

        <input type="file" id="inputLogo" @change="handleLogoChange" class="form-input" />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-update" :disabled="isLoading">Mettre à jour</button>
        <button type="button" @click.prevent="router.back()" class="btn-cancel">Annuler</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.update-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 50px 20px;
}

/* En-tête */
.update-header {
  text-align: center;
  margin-bottom: 30px;
}

.update-title {
  margin-top: 0;
  font-size: 2.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-pencil {
  margin-right: 10px;
  width: 28px;
  height: 28px;
}

.update-description {
  font-size: 1.1rem;
}

/* Formulaire */
.update-form {
  padding: 35px 45px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Groupes de champs */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group-inline {
  display: flex;
  gap: 20px;
}

.form-group-inline .form-group {
  flex: 1;
}

.form-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  border-radius: 10px;
  padding: 10px 15px;
  font-size: 1rem;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  width: 100%;
  box-sizing: border-box; /* Assure que le padding n'augmente pas la taille totale */
}

.form-input:focus,
.form-textarea:focus {
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
  outline: none;
}

.form-textarea {
  resize: vertical;
}

/* Bouton */
.form-actions {
  text-align: center;
  margin-top: 15px;
}

.btn-update {
  font-weight: 600;
  font-size: large;
  padding: 16px 28px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.603);
  min-width: 200px;
}

.btn-update:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-update:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #6c757d; /* Gris pour l'annulation */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-cancel:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Messages d'état */
.loading-state {
  text-align: center;
  font-size: 1.2rem;
  padding: 20px;
}

.alert {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
}

.alert.success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

.alert.error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.current-logo-display {
  padding: 5px;
  margin-bottom: 1%;
  text-align: center;
  background-color: #f9f9f9;
}

.current-logo-display p {
  font-size: 0.9rem;
  margin: 0 0 8px 0;
}

.company-logo-preview {
  max-width: 120px;
  max-height: 120px;
  height: auto;
  border-radius: 4px;
}

.form-hint {
  font-size: 0.8rem;
  color: #999;
  margin-top: 5px;
}

/* Responsive */
@media (max-width: 600px) {
  .update-form {
    width: 100%;
    padding: 25px 15px;
  }

  .update-title {
    font-size: 1.8rem;
  }

  .btn-update {
    width: 100%;
  }

  .form-group-inline {
    flex-direction: column;
  }
}
</style>
