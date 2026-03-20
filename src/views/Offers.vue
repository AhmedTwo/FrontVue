<script setup>
// Importe les fonctions de Vue nécessaires pour les propriétés calculées, le cycle de vie, et l'état réactif.
import { computed, onMounted, ref } from 'vue'
// Importe le store Pinia pour accéder aux informations de l'utilisateur (authentification, rôle).
import { useUserStore } from '@/stores/user'
// Importe la librairie HTTP pour effectuer des requêtes API.
import axios from 'axios'

// --- 1. Variables Réactives d'État ---
// on crée une référence réactive pour stocker la liste de toutes les offres d'emploi récupérées avec l'API.
const offers = ref([])

// on crée une référence réactive pour stocker les IDs des offres que l'utilisateur a mises en favoris.
// on utilise un Set ce qui est optimal pour vérifier rapidement si un élément est inclus (O(1)).
const favoritesIds = ref(new Set())

// Variables réactives pour stocker les valeurs des champs de recherche/filtres.
const searchCity = ref('')
const searchContract = ref('')
const searchName = ref('')
const searchDomain = ref('')

// on crée une instance du store utilisateur pour accéder aux données et à l'état d'authentification.
const userStore = useUserStore()

// --- 2. Propriétés Calculées ---
// Propriété calculée pour vérifier rapidement si l'utilisateur est une 'company'.
// Ceci évite de charger les favoris ou d'afficher le bouton Favoris pour ce rôle.
const isCompany = computed(() => userStore.user?.role === 'company')

// Propriété calculée pour filtrer la liste des offres basées sur les entrées de recherche.
// Elle se recalcule automatiquement dès que 'offers.value' ou une variable 'search...' change.
const filteredOffers = computed(() => {
  // Rend les filtres plus faciles à utiliser : en minuscule, sans espaces et sans accent (si on ajoute une librairie).
  const cityFilter = searchCity.value.toLowerCase().trim()
  const contractFilter = searchContract.value.toLowerCase().trim()
  const nameFilter = searchName.value.toLowerCase().trim()
  const domainFilter = searchDomain.value.toLowerCase().trim()

  // Optimisation : Si aucun filtre n'est saisi, retourne l'intégralité des offres sans itérer.
  if (!cityFilter && !contractFilter && !nameFilter && !domainFilter) {
    return offers.value
  }

  // on filtre les offres en appliquant toutes les conditions de recherche.
  return offers.value.filter((offer) => {
    // La fonction de vérification de filtre retourne 'true' si le filtre n'est pas appliqué (chaîne vide)
    // OU si la valeur de l'offre inclut le terme de recherche (insensible à la casse).

    // Vérification de la Ville (location)
    const matchesCity = !cityFilter || offer.location.toLowerCase().includes(cityFilter)

    // Vérification du Contrat (employment_type.name)
    const matchesContract =
      !contractFilter || offer.employment_type.name.toLowerCase().includes(contractFilter)

    // Vérification du Nom/Titre (title)
    const matchesName = !nameFilter || offer.title.toLowerCase().includes(nameFilter)

    // Vérification du Domaine (category)
    const matchesDomain = !domainFilter || offer.category.toLowerCase().includes(domainFilter)

    // L'offre doit satisfaire TOUS les filtres qui ont été saisis.
    return matchesCity && matchesContract && matchesName && matchesDomain
  })
})

// --- 3. Fonctions d'API et de Logique ---
// Fonction pour récupérer toutes les offres d'emploi disponibles.
const readOffer = async () => {
  try {
    // Envoie une requête GET vers le endpoint qui liste toutes les offres.
    const responses = await axios.get(`${import.meta.env.VITE_API_URL}/api/allOffer`)
    // Met à jour la variable réactive 'offers' avec le tableau de données.
    offers.value = responses.data.data
  } catch (err) {
    // Affiche l'erreur en console si la requête échoue.
    console.error('Erreur lors de la récupération des offres:', err)
  }
}

// Fonction pour vérifier si une offre spécifique (par ID) est dans les favoris de l'utilisateur.
// Utilise le Set pour une recherche rapide O(1).
const isFavorite = (offerId) => favoritesIds.value.has(offerId)

// Fonction pour récupérer les IDs des offres favorites de l'utilisateur connecté.
const fetchFavorites = async () => {
  // Condition de garde : sort si l'utilisateur n'est pas connecté ou est une entreprise.
  if (!userStore.isAuthenticated || isCompany.value) {
    return
  }

  const token = localStorage.getItem('auth_token')
  // Condition de garde si le token est manquant malgré l'état d'authentification.
  if (!token) {
    console.warn("Jeton d'authentification manquant pour charger les favoris.")
    return
  }

  try {
    // Envoie une requête GET vers le endpoint des favoris.
    const responses = await axios.get(`${import.meta.env.VITE_API_URL}/api/favorites`, {
      headers: {
        // Ajoute l'en-tête d'autorisation Bearer Token pour les routes protégées.
        Authorization: `Bearer ${token}`,
      },
    })

    // Extrait les IDs : crée un tableau contenant uniquement l'ID de chaque offre favorite.
    const ids = responses.data.data.map((offer) => offer.id)
    // Met à jour le Set réactif 'favoritesIds' pour une utilisation rapide.
    favoritesIds.value = new Set(ids)
  } catch (err) {
    console.error('Erreur lors de la récupération des favoris:', err)
    // Gestion des erreurs (401, etc.)
  }
}

// Fonction pour ajouter ou retirer une offre des favoris.
const toggleFavorite = async (offerId) => {
  // Condition de garde : l'action nécessite une authentification et n'est pas pour une company.
  if (!userStore.isAuthenticated || isCompany.value) {
    return
  }

  const token = localStorage.getItem('auth_token')
  if (!token) return // Condition de garde si le token est manquant.

  const isCurrentlyFavorite = isFavorite(offerId)

  // Détermine l'action et la méthode HTTP appropriées.
  const action = isCurrentlyFavorite ? 'remove' : 'add'
  const method = isCurrentlyFavorite ? 'delete' : 'post'
  // Construit l'URL complète dynamiquement.
  const url = `${import.meta.env.VITE_API_URL}/api/favorites/${action}/${offerId}`

  try {
    // Exécute la requête HTTP (POST pour ajouter, DELETE pour retirer).
    await axios({
      method: method,
      url: url,
      headers: {
        // Ajoute le token pour l'autorisation.
        Authorization: `Bearer ${token}`,
      },
    })

    // Met à jour l'état local (favoritesIds) immédiatement après le succès de l'API.
    if (isCurrentlyFavorite) {
      favoritesIds.value.delete(offerId) // Retirer l'ID du Set
    } else {
      favoritesIds.value.add(offerId) // Ajouter l'ID au Set
    }

    // OPTIMISATION/CORRECTION : on force Vue à détecter la modification du Set.
    // Vue ne réagit pas aux méthodes .add() ou .delete() d'un Set réactif,
    // donc on lui assigne une nouvelle instance de Set pour forcer la mise à jour des composants dépendants.
    favoritesIds.value = new Set(favoritesIds.value)
  } catch (err) {
    console.error('Erreur lors de la mise à jour des favoris:', err)
    alert('Erreur lors de la mise à jour des favoris. Veuillez réessayer.')
  }
}

// --- 4. Hooks du Cycle de Vie ---
// 'onMounted' est appelé une fois que le composant est monté dans le DOM.
// 1. Appel de la fonction pour récupérer toutes les offres.
onMounted(readOffer)

// 2. Logique d'authentification et de chargement des favoris.
onMounted(() => {
  // Vérifie si un token d'authentification est présent au chargement de la page.
  if (localStorage.getItem('auth_token') !== null) {
    // Si oui, on met à jour l'état d'authentification dans le store (si non fait par l'intercepteur).
    userStore.isAuthenticated = true
    // Lance le chargement des favoris de l'utilisateur connecté.
    fetchFavorites()
  }
})

// --- 5. Exportation (nécessaire avec <script setup>) ---
// Rendre les variables et fonctions disponibles pour la partie <template> du composant.
// (Inclus implicitement par <script setup> mais listé ici pour la clarté conceptuelle)
// { offers, searchCity, searchContract, searchName, searchDomain, filteredOffers, isFavorite, toggleFavorite }
</script>

<template>
  <div class="header-section">
    <h1>NOS OFFRES</h1>
    <p class="subtitle">Découvrez toutes nos opportunités publiées</p>
  </div>

  <div class="search-bar-section">
    <div class="search-grid">
      <input
        type="text"
        v-model="searchCity"
        placeholder="Ville (Ex: Paris)"
        class="search-input"
      />
      <input
        type="text"
        v-model="searchContract"
        placeholder="Contrat (Ex: CDI)"
        class="search-input"
      />
      <input
        type="text"
        v-model="searchName"
        placeholder="Nom/Titre (Ex: Développeur)"
        class="search-input"
      />
      <input
        type="text"
        v-model="searchDomain"
        placeholder="Domaine (Ex: Informatique)"
        class="search-input"
      />
    </div>
  </div>

  <div class="offers-grid">
    <div v-if="filteredOffers.length === 0" class="no-results-message">
      <p>
        😢 **Aucune offre ne correspond à vos critères de recherche.** Veuillez essayer avec
        d'autres termes.
      </p>
    </div>
    <div class="offer-card" v-for="offer in filteredOffers" :key="offer.id">
      <div class="card-image">
        <img :src="`${import.meta.env.VITE_API_URL}` + offer.image_url" alt="Image offre" />
        <div class="image-overlay">
          <span class="badge badge-employment">{{ offer.employment_type.name }}</span>
          <span class="badge badge-category">{{ offer.category }}</span
          ><br /><br />
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
            <!-- changer le format de la date -->
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

      <div class="card-footer" v-if="userStore.isAuthenticated && !isCompany">
        <a :href="`/offers/apply/${offer.id}`" class="btn-apply">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"
            />
          </svg>
          Postuler à l'offre
        </a>

        <button
          @click="toggleFavorite(offer.id)"
          class="btn-heart"
          :class="{ 'is-favorite': isFavorite(offer.id) }"
          style="margin: 2%"
          aria-label="Ajouter aux favoris"
        >
          <span style="font-size: 35px">
            {{ isFavorite(offer.id) ? '♥' : '♡' }}
          </span>
        </button>
      </div>
      <div class="card-footer" v-else-if="isCompany">
        <span class="btn-apply"
          >Les entreprises ne peuvent pas postuler ou ajouter aux favoris.</span
        >
      </div>
      <div class="card-footer" v-else>
        <a href="/SignIn" class="btn-apply">Connectez-vous pour postuler</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* En-tête */
.header-section {
  text-align: center;
  margin-bottom: 50px;
  padding: 0 20px;
}

h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: black;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 400;
  letter-spacing: 0.3px;
}

/* NOUVEAU: Styles pour la barre de recherche */
.search-bar-section {
  max-width: 1000px;
  margin: -20px auto 40px auto; /* Ajuste la marge pour se rapprocher du titre */
  padding: 0 24px;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  padding: 20px;
  background: #f8faff; /* Arrière-plan clair pour la section de recherche */
  border-radius: 12px;
  box-shadow: 0 10px 30px -5px rgba(52, 152, 219, 0.1);
  border: 1px solid #e0e7ff;
}

.search-input {
  padding: 12px 15px;
  border: 2px solid #e0e7ff;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #334155;
  transition: all 0.3s ease;
  background: white;
  outline: none;
}

.search-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}

.search-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

/* NOUVEAU: Message "Aucun résultat" */
.no-results-message {
  grid-column: 1 / -1; /* Prend toute la largeur de la grille */
  text-align: center;
  padding: 40px;
  background: #fffbe6;
  border: 1px dashed #fcd34d;
  border-radius: 10px;
  color: #854d0e;
  font-size: 1.1rem;
}

/* Grille des offres */
.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 20px auto;
  margin-bottom: 60px;
  padding: 0 24px;
}

/* Carte d'offre */
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

/* c quoi ???  */
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
  height: 140px;
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

/* Corps de carte */
.card-body {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  background: white;
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
  display: -webkit-box;
  overflow: hidden;
}

/* Détails de l'offre */
.offer-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 2px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.detail-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #3498db, #2ecc71);
  transform: translateX(-3px);
  transition: transform 0.3s ease;
}

.detail-row:hover::before {
  transform: translateX(0);
}

.detail-row:hover {
  background: white;
  border-color: #e0e7ff;
  transform: translateX(6px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.1);
}

.icon {
  width: 20px;
  height: 20px;
  color: #3498db;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.detail-row:hover .icon {
  transform: scale(1.15);
}

.detail-row span {
  color: #475569;
  font-weight: 500;
}

/* Sections mission et avantages */
.mission-section,
.benefits-section {
  margin-top: 2px;
  padding: 12px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 10px;
  font-size: 0.82rem;
  border: 1px solid #bae6fd;
  transition: all 0.3s ease;
}

.mission-section:hover,
.benefits-section:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
}

.mission-section strong,
.benefits-section strong {
  color: #0c4a6e;
  display: block;
  margin-bottom: 4px;
  font-size: 0.85rem;
  font-weight: 700;
}

.mission-section p,
.benefits-section p {
  margin: 0;
  color: #0369a1;
  line-height: 1.5;
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
}

.badge:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.badge-category {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.9) 0%, rgba(41, 128, 185, 0.9) 100%);
  color: white;
}

.badge-employment {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.9) 0%, rgba(39, 174, 96, 0.9) 100%);
  color: white;
}

/* Pied de carte */
.card-footer {
  padding: 14px 18px 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, transparent 0%, #f8fafc 100%);
}

.btn-apply {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(52, 152, 219, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-apply::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-apply:hover::before {
  left: 100%;
}

.btn-apply:hover {
  background: linear-gradient(135deg, #2980b9 0%, #21618c 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(52, 152, 219, 0.4);
}

.btn-apply:active {
  transform: translateY(-1px);
}

.btn-apply svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-apply:hover svg {
  transform: translateY(3px);
}

/* Bouton cœur (favoris) */
.btn-heart {
  text-decoration: none;
  color: #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.btn-heart::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-heart:hover::before {
  opacity: 1;
}

.btn-heart:hover {
  color: #ef4444;
  border-color: #ef4444;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-heart:active {
  transform: scale(0.95);
}

/* NOUVEAU: Style pour le cœur rempli (favori) */
.btn-heart.is-favorite {
  color: #ef4444; /* Rouge pour le cœur rempli */
  border-color: #ef4444;
  background-color: #fee2e2; /* Un fond léger pour le cœur rempli */
}

.btn-heart.is-favorite span {
  color: #ef4444;
  line-height: 1;
}

/* Responsive */
@media (max-width: 1024px) {
  .offers-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 28px;
  }
}

@media (max-width: 768px) {
  .search-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .offers-grid {
    grid-template-columns: 1fr;
    padding: 0 16px;
    gap: 24px;
  }

  .card-image {
    height: 200px;
  }

  .card-body {
    padding: 24px 20px;
  }

  .card-footer {
    flex-direction: column;
    gap: 12px;
  }

  .btn-apply {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.75rem;
  }

  .header-section {
    margin-bottom: 40px;
  }

  .card-image {
    height: 180px;
  }

  .offer-title {
    font-size: 1.2rem;
  }

  .btn-apply {
    padding: 12px 20px;
    font-size: 0.9rem;
  }
}
</style>
