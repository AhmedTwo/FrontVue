<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { RouterLink } from 'vue-router'

// --- CONFIGURATION API ---
const apiUrl = import.meta.env.VITE_API_URL

const userStore = useUserStore()

const offers = ref([])
const company = ref(null)

const token = localStorage.getItem('auth_token')

// CHARGEMENT DES OFFRES
const loadOffers = async () => {
  if (!token) return

  try {
    const responses = await axios.get(`${apiUrl}/api/myOffers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    offers.value = responses.data.data
  } catch (err) {
    console.error('Erreur lors de la récupération des offres :', err)
  }
}

// CHARGEMENT DES DÉTAILS DE LA SOCIÉTÉ
const loadCompanyDetails = async () => {
  const companyId = userStore.user?.company_id

  if (!companyId) return

  try {
    // CORRECTION : Utilisation de apiUrl au lieu de 127.0.0.1
    const responses = await axios.get(`${apiUrl}/api/companyById/${companyId}`)
    company.value = responses.data.data
  } catch (err) {
    console.error("Erreur lors de la récupération des détails de l'entreprise :", err)
  }
}

// FONCTION DE SUPPRESSION D'OFFRE
const deleteOffer = async (offerId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
    try {
      // CORRECTION : Utilisation de apiUrl au lieu de 127.0.0.1
      await axios.delete(`${apiUrl}/api/deleteOffer/${offerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      offers.value = offers.value.filter((req) => req.id !== offerId)
    } catch (err) {
      console.error("Erreur lors de la suppression de l'offre :", err)
      alert('Erreur lors de la suppression.')
    }
  }
}

onMounted(() => {
  loadOffers()
  loadCompanyDetails()
})
</script>

<template>
  <div class="main-container">
    <div v-if="company" class="company-details-section">
      <div class="company-header">
        <h1>{{ company.name }}</h1>
        <p class="subtitle">
          Dans le domaine de la '{{ company.industry }}' situé à {{ company.address }}
        </p>
      </div>

      <div class="company-info-grid">
        <div class="detail-card">
          <div class="detail-content">
            <h2 class="card-title">Informations Clés :</h2>
            <p>
              <strong class="label">N° Siret :</strong>
              <span class="data">{{ company.n_siret }}</span>
            </p>
            <p>
              <strong class="label">Email :</strong>
              <span class="data">{{ company.email_company }}</span>
            </p>
            <p>
              <strong class="label">Employés :</strong>
              <span class="data">{{ company.number_of_employees }}</span>
            </p>
            <p>
              <strong class="label">Statut :</strong>
              <span
                :class="[
                  'badge-status',
                  {
                    'badge-active': company.status === 'Approuvée',
                    'badge-pending': company.status === 'En_attente',
                    'badge-inactive': company.status === 'Refusée',
                  },
                ]"
              >
                {{ company.status }}
              </span>
            </p>
            <p>
              <strong class="label">Crée le :</strong>
              <span class="data">{{ company.created_at }}</span>
            </p>
          </div>
          <RouterLink :to="{ name: 'Modif Company Dashboard' }" class="btn btn-update-company">
            Modifier la Société
          </RouterLink>
        </div>

        <div class="detail-card card-description">
          <img
            :src="apiUrl + '/storage/' + company.logo"
            :alt="`Logo ${company.name}`"
            class="company-logo"
            v-if="company.logo"
          />
          <p class="company-description">
            <span style="font-weight: 800">Description :</span> {{ company.description }}
          </p>
        </div>
      </div>
    </div>

    <hr v-if="company" class="divider" />

    <div class="header-section">
      <h1>MES OFFRES</h1>
      <p class="subtitle">Gérez ici toutes les offres d'emploi de votre société !</p>
    </div>

    <div class="action-bar">
      <RouterLink :to="{ name: `Ajout d'une offre` }" class="btn-add">Ajouter une offre</RouterLink>
    </div>

    <div class="offers-grid">
      <div class="offer-card" v-for="offer in offers" :key="offer.id">
        <div class="card-image">
          <img :src="apiUrl + offer.image_url" alt="Image offre" />
          <div class="image-overlay">
            <span class="badge badge-employment">{{ offer.employment_type.name }}</span>
            <span class="badge badge-category">{{ offer.category }}</span>
          </div>
        </div>

        <div class="card-body">
          <h3 class="offer-title">{{ offer.title }}</h3>
          <p class="offer-description">{{ offer.description }}</p>
        </div>

        <div class="card-footer">
          <RouterLink
            :to="{ name: 'Modif Offre Company', params: { id: offer.id } }"
            class="btn btn-update"
            >Modifier</RouterLink
          >
          <button type="button" class="btn btn-delete" @click="deleteOffer(offer.id)">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CONTENEUR PRINCIPAL */
.main-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

/* SECTION DÉTAILS DE LA SOCIÉTÉ */
.company-details-section {
  margin-bottom: 60px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.company-header {
  padding: 32px 32px 24px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.company-header h1 {
  font-size: 2rem;
  color: #111827;
  margin-bottom: 8px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.company-header .subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.company-info-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
}

.detail-card {
  background: white;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #e5e7eb;
}

.detail-card:last-child {
  border-right: none;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.detail-content p {
  margin: 14px 0;
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.6;
}

.label {
  color: #6b7280;
  font-weight: 500;
  min-width: 110px;
  display: inline-block;
  font-size: 0.9rem;
}

.data {
  color: #111827;
}

.card-description {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.company-logo {
  max-width: 140px;
  height: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.company-description {
  line-height: 1.6;
  color: #374151;
  font-size: 0.95rem;
  width: 100%;
}

/* Badges de Statut */
.badge-status {
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.85rem;
  text-transform: capitalize;
  display: inline-block;
}

.badge-active {
  background: #d1fae5;
  color: #065f46;
}

.badge-pending {
  background: #fef3c7;
  color: #92400e;
}

.badge-inactive {
  background: #fee2e2;
  color: #991b1b;
}

/* Bouton Modifier Société */
.btn-update-company {
  margin-top: 24px;
  background: #3498db;
  color: white;
  border: none;
  font-size: 0.95rem;
  padding: 11px 22px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn-update-company:hover {
  background: #2980b9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.btn-update-company svg {
  width: 16px;
  height: 16px;
}

.loading-message {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #475569;
}

.divider {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), #a3a3a3, rgba(0, 0, 0, 0));
  margin: 50px 0;
}

/* EN-TÊTE SECTION OFFRES */
.header-section {
  text-align: center;
  margin-bottom: 50px;
  padding: 0 20px;
}

.header-section h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
}

.header-section .subtitle {
  font-size: 1.1rem;
  color: #64748b;
  letter-spacing: 0.3px;
}

/* Barre d'action */
.action-bar {
  max-width: 67%;
  margin: 0 auto 30px;
}

.btn-add {
  display: inline-flex;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  color: #0066ff;
  border: 2px solid #0066ff;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 102, 255, 0.3);
}

.btn-add:hover {
  background: #0066ff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
}

.btn-add:hover svg {
  transform: rotate(90deg);
}

/* GRILLE DES OFFRES */
.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
  max-width: 1100px;
  margin: 20px auto 60px;
  padding: 0 24px;
}

/* CARTE D'OFFRE */
.offer-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  position: relative;
}

.offer-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #2ecc71, #3498db);
  background-size: 200% 100%;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 10;
}

.offer-card:hover::before {
  opacity: 1;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.offer-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 25px 50px -12px rgba(52, 152, 219, 0.25),
    0 12px 24px -8px rgba(0, 0, 0, 0.1);
  border-color: #3498db;
}

/* Image de la carte */
.card-image {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
  pointer-events: none;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.offer-card:hover .card-image img {
  transform: scale(1.1) rotate(1deg);
}

.image-overlay {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

/* Badges */
.badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.badge-category {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.9) 0%, rgba(41, 128, 185, 0.9) 100%);
}

.badge-employment {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.9) 0%, rgba(39, 174, 96, 0.9) 100%);
}

/* Corps de carte */
.card-body {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.offer-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
  transition: color 0.3s ease;
}

.offer-card:hover .offer-title {
  color: #3498db;
}

.offer-description {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* Détails de l'offre */
.offer-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 2px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.detail-row:hover {
  background: #e9f3fe;
  transform: translateX(3px);
}

.icon {
  width: 16px;
  height: 16px;
  color: #3498db;
  flex-shrink: 0;
}

.detail-row span {
  color: #475569;
  font-weight: 500;
}

/* Sections mission et avantages */
.mission-section,
.benefits-section {
  margin-top: 2px;
  padding: 10px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  font-size: 0.78rem;
  border: 1px solid #bae6fd;
}

.mission-section strong,
.benefits-section strong {
  color: #0c4a6e;
  display: block;
  margin-bottom: 3px;
  font-size: 0.8rem;
  font-weight: 700;
}

.mission-section p,
.benefits-section p {
  margin: 0;
  color: #0369a1;
  line-height: 1.4;
}

/* PIED DE CARTE */
.card-footer {
  padding: 14px 18px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, transparent 0%, #f8fafc 100%);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 18px;
}

/* Bouton Modifier */
.btn-update {
  background: white;
  color: #3498db;
  border: 2px solid #3498db;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.btn-update:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

/* Bouton Supprimer */
.btn-delete {
  background: transparent;
  color: #dc3545;
  border: 2px solid #dc3545;
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.2);
}

.btn-delete:hover {
  background: #dc3545;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .offers-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 900px) {
  .company-info-grid {
    grid-template-columns: 1fr;
  }

  .detail-card {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .detail-card:last-child {
    border-bottom: none;
  }

  .btn-update-company {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-section h1 {
    font-size: 1.8rem;
  }

  .offers-grid {
    grid-template-columns: 1fr;
    padding: 0 16px;
    gap: 24px;
  }

  .card-image {
    height: 180px;
  }

  .card-footer {
    flex-direction: column;
    gap: 10px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
