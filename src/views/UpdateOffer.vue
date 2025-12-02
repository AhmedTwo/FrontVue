<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const offerId = route.params.id
const isLoading = ref(true)

const types = [
  { id: 1, label: 'CDI' },
  { id: 2, label: 'CDD' },
  { id: 3, label: 'Stage' },
  { id: 4, label: 'Alternance' },
  { id: 5, label: 'Freelance' },
]

const offer = ref({
  title: '',
  category: '',
  location: '',
  employment_type_id: '',
  mission: '',
  description: '',
  technologies_used: '',
  benefits: '',
})

const loadOffer = async () => {
  const token = localStorage.getItem('auth_token')

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/offerById/${offerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Détecte automatiquement si les données sont dans "data" ou pas
    const data = response.data.data ? response.data.data : response.data

    offer.value.title = data.title
    offer.value.category = data.category
    offer.value.location = data.location
    offer.value.employment_type_id = data.employment_type_id
    offer.value.mission = data.mission
    offer.value.description = data.description
    offer.value.technologies_used = data.technologies_used
    offer.value.benefits = data.benefits

    console.log(data)
    console.log(offer)
  } catch (error) {
    console.error("Erreur lors du chargement de l'offre :", error)
    alert("Impossible de charger l'offre à modifier.")
  } finally {
    isLoading.value = false
  }
}

// Màj de l'offre'
const updateOffer = async () => {
  const token = localStorage.getItem('auth_token')

  try {
    await axios.post(
      `http://127.0.0.1:8000/api/offerUpdate/${offerId}`,
      {
        title: offer.value.title,
        category: offer.value.category,
        location: offer.value.location,
        employment_type_id: offer.value.employment_type_id,
        mission: offer.value.mission,
        description: offer.value.description,
        technologies_used: offer.value.technologies_used,
        benefits: offer.value.benefits,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    alert('✅ Offre mise à jour avec succès')
    router.push('/Dashboard_Company')
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error)
    alert("❌ Erreur lors de la mise à jour de l'offre.")
  }
}

onMounted(loadOffer)
</script>

<template>
  <div class="update-container">
    <div class="update-entete">
      <h1 class="update-title"><i class="fa-solid fa-pen-to-square"></i> MODIFIER L'OFFRE !</h1>
      <p class="update-description">Mettez à jour les informations de l'offre ci-dessous</p>
    </div>

    <div v-if="isLoading" style="text-align: center; padding: 40px">Chargement...</div>

    <form v-else class="update-form" @submit.prevent="updateOffer">
      <input type="hidden" name="id" value="1" />

      <div class="form-group">
        <label for="inputTitre" class="form-label">Titre</label>
        <input type="text" v-model="offer.title" id="inputTitre" class="form-input" />
      </div>

      <div class="form-group">
        <label for="inputPoste" class="form-label">Poste</label>
        <input type="text" v-model="offer.category" id="inputPoste" class="form-input" />
      </div>

      <div class="form-group">
        <label for="inputAdresse" class="form-label">Adresse</label>
        <input type="text" v-model="offer.location" id="inputAdresse" class="form-input" />
      </div>

      <div class="form-group">
        <label for="inputContrat" class="form-label">Type de contrat</label>
        <select id="inputContrat" v-model="offer.employment_type_id" class="form-select" required>
          <option v-for="t in types" :key="t.id" :value="t.id">{{ t.label }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="inputMission" class="form-label">Mission</label>
        <textarea
          v-model="offer.mission"
          id="inputMission"
          class="form-textarea"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="inputDescription" class="form-label">Description</label>
        <textarea
          v-model="offer.description"
          id="inputDescription"
          class="form-textarea"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="inputTechnologie" class="form-label">Technologie(s)</label>
        <input
          type="text"
          v-model="offer.technologies_used"
          id="inputTechnologie"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="inputPositif" class="form-label">Points positifs</label>
        <textarea
          v-model="offer.benefits"
          id="inputPositif"
          class="form-textarea"
          rows="2"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-update" title="Modifier">Mettre à jour</button>
        <a href="/Dashboard_Company" class="btn-cancel">Annuler</a>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* COULEURS */
/* Bleu principal (Primaire): #0d6efd */
/* Fond de page/carte: #f8f9fa / #ffffff */
/* Texte: #212529 */

/* -------------------
   CONTENEUR GLOBAL ET CARTE
   ------------------- */

.update-container {
  background-color: #ffffff; /* Fond blanc */
  border-radius: 12px;
  padding: 30px; /* Padding réduit */
  margin: 30px auto; /* Marge réduite */
  width: 90%;
  max-width: 850px; /* Largeur optimale pour 2 colonnes */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* Ombre légère */
  min-height: 80vh; /* Ajustement visuel pour le centrage */
}

/* -------------------
   EN-TÊTE
   ------------------- */
.update-entete {
  text-align: center;
  margin-bottom: 20px; /* Marge réduite */
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.update-title {
  font-size: 1.8rem; /* Titre plus petit */
  color: #0d6efd;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0;
}

.update-description {
  font-size: 0.95rem;
  color: #64748b; /* Gris subtil */
  margin-top: 5px;
}

/* -------------------
   FORMULAIRE (GRILLE 2 COLONNES)
   ------------------- */

.update-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px 25px; /* Gap vertical et horizontal ajusté */
  justify-content: space-between;
}

.form-group {
  display: flex;
  flex-direction: column;
  /* La plupart des champs tiennent sur 2 colonnes, sauf les textareas */
  flex: 1 1 calc(50% - 12.5px);
}

/* Textareas (Mission, Description, Points Positifs) prennent toute la largeur */
.form-group:nth-child(5), /* Mission */
.form-group:nth-child(6), /* Description */
.form-group:nth-child(8) /* Points positifs */ {
  flex: 1 1 100%;
}

.form-label {
  font-weight: 600;
  color: #212529;
  margin-bottom: 5px;
  font-size: 0.9rem; /* Label plus petit */
}

.form-input,
.form-select,
.form-textarea {
  border: 1px solid #ced4da;
  border-radius: 6px; /* Coins légèrement plus petits */
  padding: 10px 12px; /* Padding réduit */
  font-size: 0.95rem;
  transition: all 0.3s ease;
  outline: none;
  background-color: white;
  width: 95%;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 4px rgba(13, 110, 253, 0.3);
}

/* -------------------
   ACTIONS ET BOUTONS
   ------------------- */

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
  width: 100%; /* Prend toute la largeur de la grille */
}

.btn-update {
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px; /* Padding ajusté */
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.3);
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

.btn-update:hover {
  background-color: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.4);
}

.btn-cancel:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* -------------------
   RESPONSIVE
   ------------------- */

@media (max-width: 768px) {
  .update-container {
    padding: 20px;
    width: 95%;
  }

  .update-title {
    font-size: 1.6rem;
  }

  /* Tous les champs passent en une seule colonne */
  .form-group {
    flex: 1 1 100%;
  }
}
</style>
