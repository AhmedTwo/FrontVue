<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
// on importe useRoute de vue-router pour accéder aux paramètres de l'URL
import { useRoute } from 'vue-router'

const route = useRoute()

// on change le nom de la variable pour stocker un seul objet
const companys = ref(null)

const readCompany = async () => {
  // Récupère l'ID depuis l'URL (ex: '15' si l'URL est .../CompanyDetails/15)
  const companyId = route.params.id

  if (!companyId) {
    console.error("ID de l'entreprise non trouvé dans les paramètres de la route.")
    return
  }

  try {
    // on apl l'endpoint spécifique par ID (selon votre API Laravel)
    const responses = await axios.get(`http://127.0.0.1:8000/api/companyById/${companyId}`)

    // on stock l'objet unique dans la variable 'company'
    companys.value = responses.data.data
    console.log(companys.value)
  } catch (err) {
    console.log("Erreur lors de la récupération des détails de l'entreprise par ID :", err)
  }
}

onMounted(readCompany)
</script>

<template>
  <div class="main">
    <div class="header-section">
      <h1>Détails de la société</h1>
      <p class="subtitle">Informations complètes et détaillées</p>
    </div>

    <div class="company-details-grid" v-if="companys">
      <div class="header-card">
        <img
          :src="'http://127.0.0.1:8000/storage/' + companys.logo"
          :alt="`Logo ${companys.name}`"
        />
        <div class="company-title-block">
          <h2 class="company-main-name">{{ companys.name }}</h2>
          <p class="subtitle">{{ companys.industry }}</p>
          <span
            :class="[
              'badge-status',
              {
                'badge-active': companys.status === 'Approuvée',
                'badge-pending': companys.status === 'En_attente',
                'badge-inactive': companys.status === 'Refusée',
              },
            ]"
          >
            {{ companys.status }}
          </span>
        </div>
      </div>

      <div class="info-block">
        <h3 class="block-title">Informations Clés</h3>
        <div class="info-group">
          <div class="info-item">
            <span class="info-label">📍 Lieu</span>
            <span class="info-value">{{ companys.address }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">👥 Employés</span>
            <span class="info-value">{{ companys.number_of_employees }}</span>
          </div>
          <div class="info-item">
            <span class="info-label"># Siret</span>
            <span class="info-value siret-code">{{ companys.n_siret }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🗺️ Coordonnées</span>
            <span class="info-value">{{ companys.latitude }} / {{ companys.longitude }}</span>
          </div>
        </div>
      </div>

      <div class="description-block">
        <h3 class="block-title">Description de la Société</h3>
        <p class="description-text">{{ companys.description }}</p>
      </div>
    </div>

    <div v-else class="loading-message">
      <p>Chargement des détails de la société...</p>
    </div>
  </div>
</template>

<style scoped>
/* ================================================= */
/* 🚀 Couleurs Remplacées par des Valeurs Directes 🚀 */
/* ================================================= */

/* Valeurs utilisées :
   Primary/Accent (Bleu) : #007bff / #0056b3
   Texte : #212529 / #6c757d
   Fond : #fcfcfc (Blanc Cassé) / #ffffff (Carte)
   Bordure : #f0f0f0
   Ombre : 0 4px 10px rgba(0, 0, 0, 0.03)
*/

/* ======================================= */
/* 1. Global & Layout 📱💻 */
/* ======================================= */

.main {
  width: 60%;
  margin: 50px auto;
  padding: 20px;
  font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif;
  background-color: #bbcffa; /* Fond Blanc Cassé */
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0; /* Bordure extra-légère */
  transition: all 0.3s ease;
}

/* ----------------- Header Global ----------------- */

.header-section {
  text-align: center;
  margin-bottom: 50px;
  /* Séparateur élégant pour l'en-tête principal */
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 25px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0056b3; /* Bleu Marin (Accent) */
  margin-bottom: 5px;
  letter-spacing: 0;
  text-transform: none;
}

.subtitle {
  font-size: 1rem;
  color: #6c757d; /* Gris Moyen */
  font-weight: 400;
  margin-top: 0;
}

/* ======================================= */
/* 2. Nouveau Layout de Détails (Grid) 📐 */
/* ======================================= */

.company-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  grid-template-areas:
    'header header'
    'info description';
}

/* ----------------- Blocs de Cartes ----------------- */

.header-card {
  grid-area: header;
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 30px;
  background-color: #ffffff; /* Fond des cartes blanc pur */
  border-radius: 12px;
  /* Ligne de séparation légère et non intrusive */
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03); /* Ombre Subtile */
}

.header-card img {
  border: 3px solid rgb(4, 29, 252);
  border-radius: 50%;
  width: 150px;
}

.company-title-block {
  flex-grow: 1;
}

.company-main-name {
  font-size: 2.2rem;
  font-weight: 700;
  color: #212529; /* Gris Très Foncé */
  margin: 0 0 5px 0;
}

.info-block,
.description-block {
  padding: 25px;
  border-radius: 12px;
  background-color: #ffffff; /* Fond des cartes blanc pur */
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03); /* Ombre Subtile */
  transition: transform 0.2s ease;
}

.info-block:hover,
.description-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

.block-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0056b3; /* Bleu Marin (Accent) */
  /* Séparateur de titre simple */
  border-bottom: 1px dashed #f0f0f0;
  padding-bottom: 10px;
  margin-top: 0;
  margin-bottom: 20px;
}

/* ----------------- Détails et Liste ----------------- */

.info-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-label {
  font-weight: 400;
  color: #6c757d; /* Gris Moyen */
  font-size: 0.9rem;
  text-transform: none;
}

.info-value {
  font-weight: 600;
  color: #212529; /* Gris Très Foncé */
  text-align: right;
  max-width: 60%;
}

.siret-code {
  background: #e9f0ff;
  padding: 3px 6px;
  border-radius: 4px;
  color: #0056b3;
  font-weight: 700;
  font-family: monospace;
  font-size: 0.85rem;
}

.description-text {
  line-height: 1.7;
  color: #6c757d; /* Gris Moyen */
  font-size: 1rem;
}

/* Badges de statut */
.badge-status {
  padding: 6px 14px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.75rem;
  display: inline-block;
  margin-top: 10px;
  text-transform: capitalize;
}

.badge-active {
  background: #d4edda;
  color: #155724; /* Vert foncé */
}

.badge-pending {
  background: #fff3cd;
  color: #856404; /* Jaune/Marron */
}

.badge-inactive {
  background: #f8d7da;
  color: #721c24; /* Rouge foncé */
}

/* ----------------- Message de chargement ----------------- */
.loading-message {
  text-align: center;
  padding: 80px 20px;
  font-size: 1.2rem;
  color: #6c757d;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* ======================================= */
/* 3. Responsive (Moins de 900px) 📱 */
/* ======================================= */

@media (max-width: 900px) {
  .main {
    padding: 20px;
    margin: 20px auto;
    width: 95%;
  }

  h1 {
    font-size: 2rem;
  }

  .company-details-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'header'
      'info'
      'description';
    gap: 20px;
  }

  .header-card {
    flex-direction: column;
    text-align: center;
    padding: 25px;
    gap: 15px;
  }

  .company-main-name {
    font-size: 1.8rem;
  }

  .logo-link {
    width: 80px;
    height: 80px;
    min-width: 80px;
  }
}
</style>
