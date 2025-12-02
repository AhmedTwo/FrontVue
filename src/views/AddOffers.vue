<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false) // Indique que le processus (l'envoi de l'offre) a commencé
const error = ref(null) // Réinitialise l'état d'erreur
const success = ref(false) // Réinitialise l'état de succès

//  'ref' sert à stocker les données du formulaire et les lier aux inputs (v-model)
const offerData = ref({
  title: '',
  description: '',
  mission: '',
  location: '',
  category: '',
  contract_id: null,
  technologies_used: '',
  benefits: '',
  // NOUVEAU: Champ pour stocker l'objet File
  image_file: null,
})

// NOUVEAU: Gestion de l'upload de la photo de l'offre
const handleImageUpload = (event) => {
  // Récupère le premier fichier sélectionné
  const file = event.target.files ? event.target.files[0] : null
  offerData.value.image_file = file
}
// FIN NOUVEAU

//  fonction d'ajout (POST)
const addOffer = async () => {
  loading.value = true
  error.value = null
  success.value = false

  const token = localStorage.getItem('auth_token')
  if (!token) {
    error.value = "Erreur d'authentification. Token manquant."
    loading.value = false
    return
  }

  // IMPORTANT: On utilise FormData pour les requêtes qui contiennent un fichier.
  const formData = new FormData()

  // Remplissage des données de l'offre dans l'objet FormData
  formData.append('title', offerData.value.title)
  formData.append('description', offerData.value.description)
  formData.append('mission', offerData.value.mission)
  formData.append('location', offerData.value.location)
  formData.append('category', offerData.value.category)
  // Assurez-vous que le nom de la clé correspond au backend : employment_type_id
  formData.append('employment_type_id', offerData.value.contract_id)
  formData.append('technologies_used', offerData.value.technologies_used)
  formData.append('benefits', offerData.value.benefits)

  // NOUVEAU: Ajout du fichier image au FormData
  if (offerData.value.image_file) {
    // Le nom de la clé doit correspondre au nom attendu par Laravel dans la validation
    formData.append('image_url', offerData.value.image_file)
  }
  // FIN NOUVEAU

  try {
    // ATTENTION: Quand on envoie un FormData, on n'ajoute PAS le 'Content-Type': 'multipart/form-data'
    // Axios et le navigateur le gèrent automatiquement, et l'ajouter manuellement cause souvent des erreurs.
    const response = await axios.post('http://127.0.0.1:8000/api/addOffer', formData, {
      headers: {
        Authorization: `Bearer ${token}`, // 'Content-Type' est retiré ou commenté car FormData le gère
        // 'Content-Type': 'application/json', // NON, c'est pour du JSON simple
      },
    })

    success.value = true
    console.log('Offre ajoutée:', response.data) // redirection après succès

    setTimeout(() => {
      router.push('/Dashboard_Company')
    }, 1000)
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'offre:", err.response?.data || err) // Gestion détaillée des erreurs de validation de Laravel
    if (err.response?.status === 422 && err.response?.data?.errors) {
      const errorsArray = Object.keys(err.response.data.errors).map(
        (key) => err.response.data.errors[key][0],
      )
      error.value = 'Erreur de validation. ' + errorsArray.join(' / ')
    } else {
      error.value =
        err.response?.data?.message || "Échec de l'ajout. Vérifiez les champs et la connexion."
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="containerFirst">
    <div id="containerSecond">
      <h1 class="h1Add">AJOUT D'UNE NOUVELLE OFFRE</h1>

      <form id="addForm" @submit.prevent="addOffer" class="offer-form" novalidate>
        <div class="divAdd">
          <label for="inputTitre">TITRE</label>
          <input type="text" id="inputTitre" v-model="offerData.title" class="input" required />
        </div>

        <div class="divAdd">
          <label for="inputDescription">DESCRIPTION</label>
          <input
            type="text"
            id="inputDescription"
            v-model="offerData.description"
            class="input"
            required
          />
        </div>

        <div class="divAdd">
          <label for="inputMission">MISSION</label>
          <input type="text" id="inputMission" v-model="offerData.mission" class="input" required />
        </div>

        <div class="divAdd">
          <label for="inputAdresse">ADRESSE</label>
          <input
            type="text"
            id="inputAdresse"
            v-model="offerData.location"
            class="input"
            required
          />
        </div>

        <div class="divAdd">
          <label for="inputCategory">POSTE</label>
          <input
            type="text"
            id="inputCategory"
            v-model="offerData.category"
            class="input"
            required
          />
        </div>

        <div class="divAdd">
          <label for="inputContrat">CONTRAT</label>
          <select id="inputContrat" v-model="offerData.contract_id" class="select" required>
            <option :value="null" disabled>-- Sélectionnez un contrat --</option>
            <option value="1">CDI</option>
            <option value="2">CDD</option>
            <option value="3">Stage</option>
            <option value="4">Alternance</option>
            <option value="5">Freelance</option>
          </select>
        </div>

        <div class="divAdd">
          <label for="inputTechnologie">TECHNOLOGIE UTILISÉE</label>
          <input
            type="text"
            id="inputTechnologie"
            v-model="offerData.technologies_used"
            class="input"
            required
          />
        </div>

        <div class="divAdd">
          <label for="inputPositif">POINTS POSITIFS (Avantages)</label>
          <input
            type="text"
            id="inputPositif"
            v-model="offerData.benefits"
            class="input"
            required
          />
        </div>

        <!-- Champ de fichier ajouté -->
               
        <div class="divAdd">
                    <label for="inputImage">IMAGE DE L'OFFRE (Optionnel)</label>          
          <input
            type="file"
            id="inputImage"
            accept="image/*"
            @change="handleImageUpload"
            class="input"
          />
                 
        </div>

        <div v-if="error" class="divAdd message error-message">❌ {{ error }}</div>
        <div v-if="success" class="divAdd message success-message">
          ✅ Offre ajoutée avec succès !
        </div>

        <div class="divAdd">
          <button type="submit" class="btn" :disabled="loading">
            <span v-if="loading">Ajout en cours...</span>
            <span v-else>Ajouter l'offre</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* -------------------
   COULEURS & STYLE GLOBAL
   ------------------- */
/* Bleu principal: #0d6efd */
/* Fond clair: #f8f9fa */
/* Texte: #212529 */
/* Bordure: #ced4da */
/* Ombre: 0 5px 12px rgba(0, 0, 0, 0.05) */

#containerFirst {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 35px 0;
  margin-top: 4%;
}

/* -------------------
   CARTE FORMULAIRE
   ------------------- */
#containerSecond {
  background-color: #ffffff;
  padding: 20px;
  border: none;
  border-radius: 10px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.05);
  width: 95%;
  max-width: 950px;
  margin: 0;
}

/* -------------------
   TITRE
   ------------------- */
.h1Add {
  text-align: center;
  font-size: 1.8rem;
  color: #212529;
  font-weight: 700;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

/* -------------------
   FORMULAIRE (2 colonnes flexibles)
   ------------------- */
.offer-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.divAdd {
  flex: 1 1 calc(50% - 5px);
  display: flex;
  flex-direction: column;
}

.divAdd label {
  font-weight: 600;
  margin-bottom: 3px;
  color: #212529;
  font-size: 0.85rem;
  text-transform: uppercase;
}

/* -------------------
   INPUTS / SELECTS
   ------------------- */
.input,
.select {
  padding: 8px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.input:focus,
.select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
  outline: none;
}

/* -------------------
   BOUTON
   ------------------- */
.btn {
  flex: 1 1 100%;
  padding: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  color: white;
  background-color: #0d6efd;
  box-shadow: 0 2px 5px rgba(13, 110, 253, 0.2);
  margin-top: 15px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.btn:hover {
  background-color: #0b5ed7;
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
}

.message {
  flex: 1 1 100%;
  padding: 10px 15px;
  margin-top: 10px;
  border-radius: 6px;
  font-weight: 500;
  text-align: center;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #adb5bd; /* Gris */
}

/* -------------------
   RESPONSIVE DESIGN
   ------------------- */
@media (max-width: 900px) {
  .divAdd {
    flex: 1 1 100%;
  }
}

@media (max-width: 600px) {
  #containerSecond {
    padding: 15px;
    max-width: 95%;
  }

  .h1Add {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
}
</style>
