<script setup>
import { onMounted, ref } from 'vue'
import ImagesLogo from '../assets/images/imagePortal.png'
import axios from 'axios'

// ref est une syntaxe qui permet de dynamiser une variable pour l'afficher
const nbUser = ref([])
const nbOffer = ref([])
const nbCompany = ref([])
const offers = ref([])

// const isAuthenticated = ref(false) // Simuler l'état pour l'exemple
const isAuthenticated = ref(false)

// Logique pour compter (inchangée)
const count = async () => {
  try {
    const responses = await axios.get('http://127.0.0.1:8000/api/count')
    nbUser.value = responses.data.User
    nbOffer.value = responses.data.Offer
    nbCompany.value = responses.data.Company
  } catch (err) {
    console.log(err)
  }
}
onMounted(count)

// Logique pour lire les offres (inchangée)
const readOffer = async () => {
  try {
    const responses = await axios.get('http://127.0.0.1:8000/api/allOffer')
    offers.value = responses.data.data
  } catch (err) {
    console.log(err)
  }
}
onMounted(readOffer)

// Logique d'authentification
onMounted(() => {
  if (localStorage.getItem('auth_token') !== null) {
    isAuthenticated.value = true
  }
})
</script>

<template>
  <img :src="ImagesLogo" alt="fond logo portal job" class="background-logo" />
  <main class="hero">
    <div class="hero-content">
      <h1>Votre avenir professionnel commence ici !</h1>
      <h1></h1>
      <p>
        Explorez les opportunités dans les secteurs en forte croissance : Tech, IA, Transition
        écologique, Santé... Profitez des options en télétravail, des postes hybrides, et des CDI à
        pourvoir immédiatement.
      </p>
      <div class="stats-container">
        <div class="stat-item">
          <span class="stat-number">{{ nbUser }}</span>
          <span class="stat-label">Utilisateurs inscrits</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ nbOffer }}</span>
          <span class="stat-label">Offres disponibles</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ nbCompany }}</span>
          <span class="stat-label">Sociétés inscrites</span>
        </div>
      </div>
    </div>
  </main>

  <div class="offers-section">
    <h1>Pourquoi choisir Portal Job ?</h1>
    <p class="p-pres">Portal Job est bien plus qu’un simple site d’offres d’emploi...,</p>
    <ul class="pres-ul">
      <li>✅ Accédez à des offres exclusives publiées chaque jour ✅</li>
      <li>🚀 Profitez d’un espace personnel intuitif pour gérer vos candidatures 🚀</li>
      <li>💼 Collaborez avec des entreprises innovantes 💼</li>
      <li>🌍 Découvrez les possibilités de télétravail 🌍</li>
    </ul>
  </div>

  <section class="latest-offers-section">
    <div class="header-section">
      <h1>NOS DERNIERES OFFRES</h1>
      <p class="subtitle">Découvrez les dernières opportunités publiées</p>
    </div>

    <div class="offers-grid">
      <div class="offer-card" v-for="offer in offers.slice(0, 3)" :key="offer.id">
        <div class="card-image">
          <img :src="'http://127.0.0.1:8000' + offer.image_url" alt="Image offre" />
          <div class="image-overlay">
            <span class="badge badge-employment">{{
              offer.employment_type?.name || 'Type de Contrat'
            }}</span>
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

        <div class="card-footer" v-if="isAuthenticated">
          <a href="/Home/apply" class="btn-apply">
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

          <a href="favoris" class="btn-heart" title="Ajouter aux favoris" style="margin: 2%">
            <span style="font-size: 35px">♡</span>
          </a>
        </div>
        <div class="card-footer" v-else>
          <a href="/SignIn" class="btn-apply">Connectez-vous pour postuler</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---------------------------------------------------- */
/* CSS EXISTANT POUR L'ENTÊTE ET LES STATISTIQUES */
/* ---------------------------------------------------- */
.background-logo {
  position: absolute;
  top: 0;
  width: 98.9vw;
  height: 120vh;
  object-fit: cover;
  opacity: 0.1;
  z-index: 1;
  margin-top: -2%;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #7c7373, #007bff);
  color: white;
  border-radius: 20px;
  padding: 5%;
  margin-top: -1%;
}

.hero p {
  font-size: 1.3rem;
  color: black;
  margin-bottom: 2rem;
}

.stats-container {
  display: flex;
  gap: 5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: black;
}

/* Section 'Pourquoi choisir Portal Job' */
.offers-section {
  padding: 4rem 2rem;
  background: var(--bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.offers-section h1 {
  font-size: 2rem;
  background: linear-gradient(135deg, #007bff, #7c7373);
  color: white;
  border-radius: 20px;
  padding: 10px 20%;
}

/* Section Présentation */
.p-pres {
  text-align: center;
  color: black;
  font-size: 1.2rem;
  position: relative;
}

/* Liste */
.pres-ul {
  font-size: 1rem;
  width: 80%;
  display: grid;
  gap: 1rem;
}

.pres-ul li {
  padding: 1.2rem 1.8rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.712);
  font-size: 1rem;
  color: black;
  text-align: center;
  font-weight: 500;
  list-style: none;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}

.pres-ul li:nth-child(1) {
  border-left-color: rgb(45, 226, 211);
  border-right-color: rgb(45, 226, 211);
}

.pres-ul li:nth-child(2) {
  border-left-color: rgb(20, 44, 252);
  border-right-color: rgb(20, 44, 252);
}

.pres-ul li:nth-child(3) {
  border-left-color: rgb(45, 226, 211);
  border-right-color: rgb(45, 226, 211);
}

.pres-ul li:nth-child(4) {
  border-left-color: rgb(20, 44, 252);
  border-right-color: rgb(20, 44, 252);
}

/* ---------------------------------------------------- */
/* NOUVEAU CSS POUR LES CARTES D'OFFRES (OFFERS-GRID) */
/* ---------------------------------------------------- */

.latest-offers-section {
  padding: 60px 0;
  background-color: #f8fafc; /* Fond léger pour séparer la section */
}

/* En-tête */
.header-section {
  text-align: center;
  margin-bottom: 50px;
  padding: 0 20px;
}

.latest-offers-section h1 {
  /* Cible le h1 à l'intérieur de la nouvelle section */
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
  background: none; /* Annule le style précédent du h1 */
  padding: 0; /* Annule le padding précédent */
}

.subtitle {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 400;
  letter-spacing: 0.3px;
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
  /* Optionnel : pour limiter à quelques lignes */
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
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

/* Responsive */
@media (max-width: 1024px) {
  .offers-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 28px;
  }
}

@media (max-width: 768px) {
  .latest-offers-section h1 {
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
  .latest-offers-section h1 {
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
