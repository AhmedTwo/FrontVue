<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { RouterLink } from 'vue-router'

const token = localStorage.getItem('auth_token')
const currentTab = ref('offers') // Onglet par défaut

const apiUrl = import.meta.env.VITE_API_URL

// console.log(token)

const offers = ref([])
const companys = ref([])
const users = ref([])
const requests = ref([])

const fetchData = async () => {
  try {
    // Remplace le bloc Promise.all par celui-ci :
    const [resOffers, resCompanys, resRequests, resUsers] = await Promise.all([
      axios.get(`${apiUrl}/api/allOffer`),
      axios.get(`${apiUrl}/api/allCompany`),
      axios.get(`${apiUrl}/api/allRequest`),
      axios.get(`${apiUrl}/api/allUser`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
    offers.value = resOffers.data.data
    companys.value = resCompanys.data.data
    requests.value = resRequests.data.data
    users.value = resUsers.data.data
  } catch (err) {
    console.error('Erreur API:', err)
  }
}

onMounted(fetchData)

// Fonction de suppression (appel de l'API DELETE)
const deleteUser = async (userId) => {
  // on remplace l'alert() par une confirmation modale si possible, ici on simule.
  if (confirm('Êtes-vous sûr de vouloir supprimer cette utilisateur ?')) {
    try {
      await axios.delete(`${apiUrl}/api/deleteUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Retirer l'utilisateur du tableau local sans recharger toute la page
      users.value = users.value.filter((use) => use.id !== userId)
      console.log(`Utilisateur ID ${userId} supprimée.`)
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err)
      prompt('Erreur lors de la suppression. Veuillez réessayer.')
    }
  }
}

const deleteOffer = async (offerId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
    try {
      await axios.delete(`${apiUrl}/api/deleteOffer/${offerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      offers.value = offers.value.filter((off) => off.id !== offerId)
      console.log(`Offre ID ${offerId} supprimée.`)
    } catch (err) {
      console.error("Erreur lors de la suppression de l'offre:", err)
      prompt('Erreur lors de la suppression. Veuillez réessayer.')
    }
  }
}

const deleteCompany = async (companyId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette société ?')) {
    try {
      await axios.delete(`${apiUrl}/api/deleteCompany/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      companys.value = companys.value.filter((com) => com.id !== companyId)
      console.log(`Société ID ${companyId} supprimée.`)
    } catch (err) {
      console.error('Erreur lors de la suppression de la société:', err)
      prompt('Erreur lors de la suppression. Veuillez réessayer.')
    }
  }
}

const deleteRequest = async (requestId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
    try {
      await axios.delete(`${apiUrl}/api/deleteRequest/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      requests.value = requests.value.filter((req) => req.id !== requestId)
      console.log(`Demande ID ${requestId} supprimée.`)
    } catch (err) {
      console.error('Erreur lors de la suppression de la demande:', err)
      prompt('Erreur lors de la suppression. Veuillez réessayer.')
    }
  }
}

// Fonction de changement de status
const toggleRequest = async (requestId) => {
  if (!token) {
    console.error("Jeton d'authentification manquant.")
    return
  }
  try {
    const response = await axios.patch(
      `${apiUrl}/api/toggleRequestStatus/${requestId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    // Mise à jour de l'état local (très important pour le rendu)
    const newStatus = response.data.new_status

    // Trouver la demande dans le tableau réactif 'requests' et mettre à jour son statut
    const index = requests.value.findIndex((req) => req.id === requestId)
    if (index !== -1) {
      requests.value[index].status = newStatus
    }

    console.log(`Statut de la demande ID ${requestId} mis à jour à : ${newStatus}`)
  } catch (err) {
    console.error('Erreur lors de la bascule du statut:', err)
    alert('Erreur lors de la mise à jour du statut. Veuillez réessayer.')
  }
}
</script>

<template>
  <div class="header-section">
    <h1>MON TABLEAU DE BORD</h1>
    <p class="subtitle">Gérez vos données efficacement.</p>
  </div>

  <div class="stats-container">
    <div class="stat-card" @click="currentTab = 'offers'">
      <h3>Offres</h3>
      <p class="stat-number">{{ offers.length }}</p>
    </div>
    <div class="stat-card" @click="currentTab = 'companys'">
      <h3>Sociétés</h3>
      <p class="stat-number">{{ companys.length }}</p>
    </div>
    <div class="stat-card" @click="currentTab = 'users'">
      <h3>Utilisateurs</h3>
      <p class="stat-number">{{ users.length }}</p>
    </div>
    <div class="stat-card" @click="currentTab = 'requests'">
      <h3>Demandes</h3>
      <p class="stat-number">{{ requests.length }}</p>
    </div>
  </div>

  <div class="tab-navigation">
    <button :class="{ active: currentTab === 'offers' }" @click="currentTab = 'offers'">
      Offres d'emploi
    </button>
    <button :class="{ active: currentTab === 'companys' }" @click="currentTab = 'companys'">
      Sociétés
    </button>
    <button :class="{ active: currentTab === 'users' }" @click="currentTab = 'users'">
      Utilisateurs
    </button>
    <button :class="{ active: currentTab === 'requests' }" @click="currentTab = 'requests'">
      Demandes
    </button>
  </div>

  <div class="content-area">
    <div v-if="currentTab === 'offers'" class="section fade-in">
      <h2 class="section-title">Offres d'emploi</h2>
      <div class="dashboard-container">
        <div v-for="offer in offers" :key="offer.id" class="card">
          <div class="card-content">
            <div class="card-image">
              <img :src="apiUrl + offer.image_url" :alt="offer.title" />
            </div>
            <div class="card-details">
              <span class="title">{{ offer.title }}</span>
              <span class="badge">{{ offer.employment_type?.name }}</span>
              <span>Inscrits: {{ offer.participants_count }}</span>
            </div>
          </div>
          <div class="card-actions">
            <RouterLink
              :to="{ name: 'Modif Offre Company', params: { id: offer.id } }"
              class="btn btn-edit"
            >
              Modifier
            </RouterLink>
            <button
              class="btn btn-delete"
              title="Supprimer cette offre"
              @click="deleteOffer(offer.id)"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'companys'" class="section fade-in">
      <h2 class="section-title">Sociétés</h2>
      <div class="dashboard-container">
        <div v-for="company in companys" :key="company.id" class="card">
          <div class="card-content">
            <div class="card-image">
              <img :src="apiUrl + '/storage/' + company.logo" :alt="company.name" />
            </div>
            <div class="card-details">
              <span class="title">{{ company.name }}</span>
              <span class="badge">{{ company.industry }}</span>
              <span class="meta">{{ company.address }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button
              class="btn btn-delete"
              title="Supprimer cette utilisateur"
              @click="deleteCompany(company.id)"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'users'" class="section fade-in">
      <h2 class="section-title">Utilisateurs</h2>
      <div class="dashboard-container">
        <div v-for="user in users" :key="user.id" class="card">
          <div class="card-content">
            <div class="card-image">
              <img :src="apiUrl + '/storage/' + user.photo" class="user-avatar" />
            </div>
            <div class="card-details">
              <span class="title">{{ user.prenom }} {{ user.nom }}</span>
              <span class="badge">{{ user.role }}</span>
              <span>{{ user.email }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button
              class="btn btn-delete"
              title="Supprimer cette utilisateur"
              @click="deleteUser(user.id)"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'requests'" class="section fade-in">
      <h2 class="section-title">Demandes</h2>
      <div class="dashboard-container">
        <div v-for="request in requests" :key="request.id" class="card">
          <div class="card-content">
            <div class="card-details">
              <span class="meta"
                ><span style="color: black; font-weight: 600; font-size: 20px">Titre : </span
                >{{ request.title }}</span
              >
              <span class="badge">{{ request.type }}</span>
              <span class="meta"
                ><span style="color: black; font-weight: 600; font-size: 20px">Description : </span
                >{{ request.description }}</span
              >
              <span class="meta"
                ><span style="color: black; font-weight: 600; font-size: 20px">Statut : </span
                >{{ request.status }}</span
              >
            </div>
          </div>
          <div class="card-actions">
            <button
              class="btn btn-delete"
              title="Supprimer cette utilisateur"
              @click="deleteRequest(request.id)"
            >
              Supprimer
            </button>
            <button type="button" class="btn-toggle" @click="toggleRequest(request.id)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.content-area {
  background-color: rgba(128, 128, 128, 0.205);
  padding: 20px 0;
}

/* --- EN-TÊTE --- */
.header-section {
  text-align: left;
  padding: 2rem 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ececec;
  text-align: center;
}

.header-section h1 {
  color: #1a1a1a;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #71717a;
  font-size: 1rem;
  margin-top: 5px;
}

/* --- STATISTIQUES --- */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2.5rem;
  padding: 0 1.5rem;
}

.stat-card {
  background: #1538ff49;
  padding: 1rem;
  border-radius: 16px;
  border: 2px solid;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  border: 2px solid #1115fa;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.473);
}

.stat-card h3 {
  margin: 0;
  font-size: 1rem;
  color: black;
  font-weight: 700;
}

.stat-card .stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #18181b;
  margin: 8px 0 0 0;
}

/* --- NAVIGATION PAR ONGLETS --- */
.tab-navigation {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: #f4f4f5;
  border-radius: 12px;
  width: fit-content;
  margin: 0 auto 2.5rem auto;
}

.tab-navigation button {
  padding: 8px 20px;
  border: none;
  background: transparent;
  color: #71717a;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.tab-navigation button.active {
  background: #ffffff;
  color: blue;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* --- GRILLE ET CARTES --- */
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #18181b;
  margin-bottom: 1.5rem;
}

.dashboard-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  border: 2px solid;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.08);
  border: 2px solid #1115fa;
}

.card-content {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-image img {
  width: 90px;
  height: 90%;
  object-fit: cover;
  border-radius: 10px;
}

.user-avatar {
  border-radius: 50% !important;
}

.card-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-details .title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #18181b;
  margin-bottom: 10%;
}

.card-details span {
  font-size: 0.85rem;
  color: #71717a;
}

.badge {
  display: inline-block;
  padding: 2px 10px;
  background: #f4f4f5;
  color: #3f3f46;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin: 6px 0;
  width: fit-content;
}

/* --- BOUTONS D'ACTION --- */
.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn {
  flex: 1;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.btn a {
  padding: 8px;
  text-decoration: none;
  display: block;
}

.btn-edit {
  background: #18181b;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: white;
  padding: 8px;
}

.btn-edit:hover {
  background: #3f3f46;
  color: white;
}

.btn-delete {
  background: #ffffff;
  border-color: #fee2e2;
  color: red;
  padding: 2.5%;
}

.btn-delete a {
  color: #ef4444;
}

.btn-delete:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

.btn-toggle {
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.btn-toggle svg {
  width: 20px;
  height: 20px;
}

/* Styles spécifiques : Toggle/Valider (Vert/Bleu) */
.btn-toggle {
  color: #28a745; /* Vert pour la validation */
  border: 1px solid #28a745;
}

.btn-toggle:hover {
  background: #28a745;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

/* --- ANIMATION --- */
.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* --- RESPONSIVE --- */
@media (max-width: 640px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  .dashboard-container {
    grid-template-columns: 1fr;
  }
  .tab-navigation {
    width: 100%;
    overflow-x: auto;
  }
}
</style>
