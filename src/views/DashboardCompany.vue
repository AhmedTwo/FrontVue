<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()

const offers = ref([])
const company = ref(null) // Pour stocker les détails de la société

//  on recup le token d'authentification depuis le localStorage
const token = localStorage.getItem('auth_token')

//  CHARGEMENT DES OFFRES
const loadOffers = async () => {
  if (!token) {
    console.error("Token d'authentification manquant.")
    return
  }

  try {
    const responses = await axios.get('http://127.0.0.1:8000/api/myOffers', {
      headers: { Authorization: `Bearer ${token}` },
    })
    offers.value = responses.data.data
  } catch (err) {
    console.error('Erreur lors de la récupération des offres :', err)
    // Gestion de l'erreur d'API ou d'expiration du token
  }
}

//  CHARGEMENT DES DÉTAILS DE LA SOCIÉTÉ
const loadCompanyDetails = async () => {
  const companyId = userStore.user?.company_id

  if (!companyId) {
    // C'est normal si l'utilisateur n'est pas lié à une entreprise (ex: simple candidat)
    console.log("L'utilisateur n'est pas associé à une société (company_id est null).")
    return
  }

  try {
    // Appel de l'endpoint pour récupérer la société par son ID
    const responses = await axios.get(`http://127.0.0.1:8000/api/companyById/${companyId}`)
    company.value = responses.data.data
  } catch (err) {
    console.error("Erreur lors de la récupération des détails de l'entreprise :", err)
  }
}

//  FONCTION DE SUPPRESSION D'OFFRE
const deleteOffer = async (offerId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deleteOffer/${offerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Retirer l'offre du tableau local
      offers.value = offers.value.filter((req) => req.id !== offerId)
      console.log(`Offre ID ${offerId} supprimée.`)
    } catch (err) {
      console.error("Erreur lors de la suppression de l'offre :", err)
      alert('Erreur lors de la suppression. Veuillez réessayer.')
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
              />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </svg>
            Modifier la Société
          </RouterLink>
        </div>

        <div class="detail-card card-description">
          <img
            :src="'http://127.0.0.1:8000/storage/' + company.logo"
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

    <div v-else-if="userStore.user?.company_id !== null" class="loading-message">
      <p>Chargement des détails de la société...</p>
    </div>

    <hr v-if="company" class="divider" />

    <div class="header-section">
      <h1>MES OFFRES</h1>
      <p class="subtitle">Gérez ici toutes les offres d'emploi de votre société !</p>
    </div>

    <div class="action-bar">
      <RouterLink :to="{ name: `Ajout d'une offre` }" class="btn-add">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
          />
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
          />
        </svg>
        Ajouter une offre
      </RouterLink>
    </div>

    <div class="offers-grid">
      <div class="offer-card" v-for="offer in offers" :key="offer.id">
        <div class="card-image">
          <img :src="'http://127.0.0.1:8000' + offer.image_url" alt="Image offre" />
          <div class="image-overlay">
            <span class="badge badge-employment">{{ offer.employment_type.name }}</span>
            <span class="badge badge-category">{{ offer.category }}</span>
          </div>
        </div>

        <div class="card-body">
          <h3 class="offer-title">{{ offer.title }}</h3>
          <p class="offer-description">{{ offer.description }}</p>

          <div class="offer-details">
            <div class="detail-row">
              <svg
                class="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{{ offer.location }}</span>
            </div>

            <div class="detail-row">
              <svg
                class="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>{{ offer.participants_count }} postulants</span>
            </div>

            <div class="detail-row">
              <svg
                class="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>{{ offer.created_at }}</span>
            </div>
          </div>

          <div class="mission-section" v-if="offer.mission">
            <strong>Mission :</strong>
            <p>{{ offer.mission }}</p>
          </div>

          <div class="benefits-section" v-if="offer.benefits">
            <strong>Avantages :</strong>
            <p>{{ offer.benefits }}</p>
          </div>
        </div>

        <div class="card-footer">
          <RouterLink
            :to="{ name: 'Modif Offre Company', params: { id: offer.id } }"
            class="btn btn-update"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
              />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </svg>
            Modifier
          </RouterLink>
          <button
            type="button"
            class="btn btn-delete"
            title="Supprimer cette demande"
            @click="deleteOffer(offer.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
              />
            </svg>
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
