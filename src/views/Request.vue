<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

// ref est une syntaxe qui permet de dynamiser une variable pour l'afficher dans le html
const requests = ref([])
const userStore = useUserStore()

//  on recup le token d'authentification depuis le localStorage
const token = localStorage.getItem('auth_token')

const readRequest = async () => {
  // temps de chargement front plus rapide, avec la donnée qui arrive
  try {
    const responses = await axios.get('http://127.0.0.1:8000/api/allRequest', {
      headers: { Authorization: `Bearer ${token}` },
    })

    requests.value = responses.data.data
    // console.log(requests.value)
  } catch (err) {
    console.log(err)
  }
}

onMounted(readRequest)

// Vérifier si l'utilisateur est admin
const isAdmin = computed(() => userStore.user?.role === 'admin')

const nbRequest = ref([])

// Logique pour compter (inchangée)
const count = async () => {
  try {
    const responses = await axios.get('http://127.0.0.1:8000/api/count')
    nbRequest.value = responses.data.Request
  } catch (err) {
    console.log(err)
  }
}

// Fonction de suppression (appel de l'API DELETE)
const deleteRequest = async (requestId) => {
  // on remplace l'alert() par une confirmation modale si possible, ici on simule.
  if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deleteRequest/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Retirer la demande du tableau local sans recharger toute la page
      requests.value = requests.value.filter((req) => req.id !== requestId)
      console.log(`Demande ID ${requestId} supprimée.`)
    } catch (err) {
      console.error('Erreur lors de la suppression de la demande:', err)
      prompt('Erreur lors de la suppression. Veuillez réessayer.')
    }
  }
}

onMounted(count)
</script>

<template>
  <div>
    <div class="header-section">
      <h1>TOUTES LES DEMANDES ({{ nbRequest }})</h1>
      <p class="subtitle">Gérez et modifiez l'ensemble des demandes soumises.</p>
    </div>

    <div class="requests-grid">
      <div class="request-card" v-for="request in requests" :key="request.id">
        <div class="card-header">
          <div class="user-avatar">
            <img :src="'http://127.0.0.1:8000/storage/' + request.photo" alt="Photo Utilisateur" />
          </div>
          <div class="user-info">
            <h3 class="user-name">{{ request.nom }} {{ request.prenom }}</h3>
            <p class="user-name">{{ request.qualification }}</p>
          </div>
        </div>

        <div class="card-body">
          <h4 class="request-title">{{ request.title }}</h4>
          <h4 class="request-type">{{ request.type }}</h4>
          <p class="request-description">{{ request.description }}</p>

          <div class="request-meta">
            <div class="meta-item">
              <span>{{ request.created_at }}</span>
            </div>
            <span class="badge badge-pending">{{ request.status }}</span>
          </div>
        </div>

        <div class="card-footer card-actions" v-if="isAdmin">
          <button
            type="button"
            class="btn-delete"
            title="Supprimer cette demande"
            @click="deleteRequest(request.id)"
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
          </button>

          <button type="button" class="btn-toggle" title="Valider/Changer le statut">
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
</template>

<style scoped>
/* En-tête */
.header-section {
  text-align: center;
  margin-top: 3%;
}

h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: black;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

/* Grille de demandes */
.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  /* creation auto, d'autant de colonne possible dans l'espace dispo, chacune fait min 260px et max une part egal de l'espace restant */
  gap: 24px;
  max-width: 1300px;
  margin: 1.5% auto;
}

/* Carte de demande */
.request-card {
  background: white;
  border-radius: 8%;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid rgba(0, 0, 0, 0.253);
}

.request-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.445);
  border-color: #0066ff;
}

/* En-tête de carte */
.card-header {
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 50%, #d3d7ec 0%);
  border-bottom: 2px solid black;
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 105px;
  height: 105px;
  border: 3px solid black;
  border-radius: 50%;
  overflow: hidden; /* IMPORTANT : coupe l’image qui dépasse */
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* remplit le cercle sans déformer */
}

.user-info {
  flex: 1;
  flex-direction: column;
}

.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: black;
  margin: 0;
}

/* Corps de carte */
.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: black;
  margin: 0;
}

.request-type {
  background: #093eee85;
  color: #856404;
  padding: 8px 10px;
  border-radius: 20px;
  color: white;
  width: 30%;
}

.request-description {
  font-size: 0.9rem;
  color: #666;
}

.request-meta {
  display: flex;
  justify-content: space-between;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
}

.icon {
  width: 20px;
  height: 20px;
  color: #0066ff;
}

/* Badges */
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.badge-type {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-pending {
  background: #fff3cd;
  color: #856404;
}

.badge-active {
  background: #d4edda;
  color: #155724;
}

/* Pied de carte et Actions Admin */
.card-footer {
  margin-top: auto; /* S'assure qu'il reste en bas */
  padding: 16px 20px;
  border-top: 2px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* Espace entre les boutons d'action */
}

/* Base des boutons d'action (Supprimer et Toggle) */
.btn-delete,
.btn-toggle {
  border: none;
  cursor: pointer;
  padding: 8px; /* Taille plus compacte pour le pied de page */
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.btn-delete svg,
.btn-toggle svg {
  width: 20px;
  height: 20px;
}

/* Styles spécifiques : Supprimer (Rouge) */
.btn-delete {
  color: #dc3545;
  border: 1px solid #dc3545;
}

.btn-delete:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
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

/* Responsive */
@media (max-width: 1350px) {
  .requests-grid {
    max-width: 100%;
  }
}

@media (max-width: 1024px) {
  .requests-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 30px 15px;
  }

  h1 {
    font-size: 1.8rem;
  }

  .requests-grid {
    grid-template-columns: 1fr;
  }

  .action-bar {
    justify-content: center;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }
}
</style>
