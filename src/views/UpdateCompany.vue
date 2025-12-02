<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 💡 FIX 1: Définir l'état 'message' pour éviter le TypeError et gérer l'UX
const message = ref({
  text: null,
  type: '',
})

const companyId = userStore.user.company_id
const isLoading = ref(true)

const token = localStorage.getItem('auth_token')

// NOUVEAU: Référence pour le fichier logo sélectionné
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

// FONCTION pour gérer la sélection du fichier
const handleLogoChange = (event) => {
  const file = event.target.files[0]
  newLogoFile.value = file
}

const loadCompany = async () => {
  const token = localStorage.getItem('auth_token')

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/companyById/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Détecte automatiquement si les données sont dans "data" ou pas
    const data = response.data.data ? response.data.data : response.data

    company.value.name = data.name
    company.value.logo = data.logo
    company.value.number_of_employees = data.number_of_employees
    company.value.industry = data.industry
    company.value.address = data.address
    company.value.description = data.description
    company.value.email_company = data.email_company
    company.value.n_siret = data.n_siret

    console.log(data)
  } catch (error) {
    console.error('Erreur lors du chargement de la société :', error)
    // Remplacement d'alert
    message.value.text = 'Impossible de charger la société à modifier.'
    message.value.type = 'error'
  } finally {
    isLoading.value = false
  }
}

const updateCompany = async () => {
  const formData = new FormData()
  message.value.text = null // Réinitialiser le message à null

  formData.append('name', company.value.name)
  formData.append('number_of_employees', company.value.number_of_employees ?? '')
  formData.append('industry', company.value.industry)
  formData.append('address', company.value.address)
  formData.append('description', company.value.description)
  formData.append('email_company', company.value.email_company)
  formData.append('n_siret', company.value.n_siret ? String(company.value.n_siret) : '')
  // Ajout fichier ou chemin existant (si non modifié)
  if (newLogoFile.value) {
    // Ajout nouveau fichier
    formData.append('logo', newLogoFile.value)
  }
  // Si newLogoFile est null, cela signifie que l'utilisateur n'a pas sélectionné de nouveau fichier.
  // Dans ce cas, nous n'envoyons PAS le champ 'logo' dans FormData,
  // ce qui permet à Laravel de le gérer avec la règle 'sometimes'.

  // ce que j'envoie
  // for (let [key, value] of formData.entries()) {
  //   console.log(`${key}:`, value)
  // }

  try {
    await axios.post(`http://127.0.0.1:8000/api/companyUpdate/${companyId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Axios gère Content-Type: multipart/form-data automatiquement avec FormData
      },
    })

    message.value.text = '✅ Société mise à jour avec succès'
    message.value.type = 'success'

    setTimeout(() => {
      router.push('/Dashboard_Company')
    }, 1500)
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error)

    // FIX 3: Afficher les erreurs de validation du serveur 422 pour le debug
    if (error.response && error.response.status === 422 && error.response.data.errors) {
      const validationErrors = error.response.data.errors
      // Extrait le message de la première erreur
      const firstErrorKey = Object.keys(validationErrors)[0]
      const firstErrorMessage = validationErrors[firstErrorKey][0]

      message.value.text = `❌ Erreur de validation : ${firstErrorMessage}`
      message.value.type = 'error'

      // Pour le debug avancé, affichez toutes les erreurs dans la console
      console.error('Détails des erreurs 422:', validationErrors)
    } else {
      message.value.text = '❌ Erreur inattendue lors de la mise à jour de la société.'
      message.value.type = 'error'
    }
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
      <h1 class="update-title">
        <!-- Remplacement de l'icône FontAwesome par une SVG pour être auto-contenu -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon-pencil"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
        MODIFIER LA SOCIÉTÉ
      </h1>
      <p class="update-description">Mettez à jour les informations de la société ci-dessous.</p>
    </div>

    <!-- Message de chargement ou d'erreur/succès -->
    <div v-if="isLoading" class="loading-state">Chargement des informations actuelles...</div>

    <!-- AFFICHAGE DU MESSAGE D'ÉTAT -->
    <div v-if="message.text" :class="['alert', message.type]">
      {{ message.text }}
    </div>

    <form class="update-form" @submit.prevent="updateCompany" v-if="!isLoading">
      <!-- Nom -->
      <div class="form-group">
        <label for="inputNom" class="form-label">Nom</label>
        <input type="text" id="inputNom" v-model="company.name" class="form-input" required />
      </div>

      <!-- Nombre d'employés -->
      <div class="form-group">
        <label for="inputNbEmploye" class="form-label">Nombre d’employés</label>
        <!-- On utilise input au lieu de textarea pour les nombres -->
        <input
          type="number"
          id="inputNbEmploye"
          v-model.number="company.number_of_employees"
          class="form-input"
          required
        />
      </div>

      <!-- Domaine -->
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

      <!-- Adresse -->
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

      <!-- Description -->
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

      <!-- Email -->
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

      <!-- Numéro SIRET -->
      <div class="form-group">
        <label for="inputSiret" class="form-label">Numéro SIRET</label>
        <input type="text" v-model="company.n_siret" @blur="validateSiret" class="form-input" />
      </div>

      <!-- Logo -->
      <div class="form-group">
        <label for="inputLogo" class="form-label">Logo</label>

        <div v-if="company.logo" class="current-logo-display">
          <p>Logo actuel :</p>
          <img
            :src="`http://127.0.0.1:8000/storage/${company.logo}`"
            alt="Logo actuel de l'entreprise"
            class="company-logo-preview"
          />
        </div>

        <input type="file" id="inputLogo" @change="handleLogoChange" class="form-input" />
        <p class="form-hint">Sélectionnez un nouveau fichier pour remplacer l'ancien.</p>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-update" :disabled="isLoading">Mettre à jour</button>
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
