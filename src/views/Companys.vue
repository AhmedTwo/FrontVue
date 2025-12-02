<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const companys = ref([])

const readCompany = async () => {
  try {
    const responses = await axios.get('http://127.0.0.1:8000/api/allCompany')
    companys.value = responses.data.data
  } catch (err) {
    console.log(err)
  }
}

onMounted(readCompany)
</script>

<template>
  <div class="header-section">
    <h1>TOUTES LES SOCIÉTÉS</h1>
    <p class="subtitle">Découvrez toutes nos sociétés inscrites à Portal_Job</p>
  </div>

  <div class="company-grid">
    <div class="company-card" v-for="company in companys" :key="company.id">
      <!-- En-tête avec logo -->
      <div class="card-header">
        <div class="logo-container">
          <a :href="`/Companys/CompanyDetails/${company.id}`">
            <img
              :src="'http://127.0.0.1:8000/storage/' + company.logo"
              :alt="`Logo ${company.name}`"
            />
          </a>
        </div>
      </div>

      <!-- Corps de carte -->
      <div class="card-body">
        <h3 class="company-name">{{ company.name }}</h3>

        <div class="company-info">
          <div class="info-item">
            <svg
              class="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <span>{{ company.industry }}</span>
          </div>

          <div class="info-item">
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
            <span>{{ company.address }}</span>
          </div>
        </div>
      </div>

      <!-- Pied de carte -->
      <div class="card-footer">
        <a :href="`/Companys/CompanyDetails/${company.id}`" class="btn-details">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path
              d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
            />
          </svg>
          Voir les détails
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* En-tête */
.header-section {
  text-align: center;
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
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* Grille de cartes */
.company-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 60px;
}

/* Carte société */
.company-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
}

.company-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0066ff, #00d4ff, #0066ff);
  background-size: 200% 100%;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.company-card:hover::before {
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

.company-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 25px 50px -12px rgba(0, 102, 255, 0.25),
    0 12px 24px -8px rgba(0, 0, 0, 0.1);
  border-color: #0066ff;
}

/* En-tête de carte avec logo */
.card-header {
  padding: 40px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.card-header::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 70%);
  transition: transform 0.6s ease;
}

.company-card:hover .card-header::after {
  transform: translate(-25%, -25%);
}

.logo-container {
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 24px;
  padding: 20px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 4px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid #f1f5f9;
  position: relative;
  z-index: 1;
}

.logo-container:hover {
  transform: scale(1.15) rotate(-3deg);
  box-shadow:
    0 15px 40px rgba(0, 102, 255, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #0066ff;
}

.logo-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.logo-container:hover img {
  filter: drop-shadow(0 4px 8px rgba(0, 102, 255, 0.3));
}

/* Corps de carte */
.card-body {
  padding: 28px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: white;
}

.company-name {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  text-align: center;
  line-height: 1.4;
  letter-spacing: -0.3px;
  transition: color 0.3s ease;
}

.company-card:hover .company-name {
  color: #0066ff;
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.info-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #0066ff, #00d4ff);
  transform: translateX(-3px);
  transition: transform 0.3s ease;
}

.info-item:hover::before {
  transform: translateX(0);
}

.info-item:hover {
  background: white;
  border-color: #e0e7ff;
  transform: translateX(6px);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.1);
}

.icon {
  width: 20px;
  height: 20px;
  color: #0066ff;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.info-item:hover .icon {
  transform: scale(1.15);
}

.info-item span {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
  font-weight: 500;
}

/* Pied de carte */
.card-footer {
  padding: 20px 24px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, transparent 0%, #f8fafc 100%);
}

.btn-details {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
  color: white;
  border: none;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(0, 102, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-details::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-details:hover::before {
  left: 100%;
}

.btn-details:hover {
  background: linear-gradient(135deg, #0052cc 0%, #003d99 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 102, 255, 0.4);
}

.btn-details:active {
  transform: translateY(-1px);
}

.btn-details svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-details:hover svg {
  transform: scale(1.2) rotate(10deg);
}

/* Responsive */
@media (max-width: 1024px) {
  .company-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 28px;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .company-grid {
    grid-template-columns: 1fr;
    padding: 0 16px 40px;
    gap: 24px;
  }

  .logo-container {
    width: 110px;
    height: 110px;
  }

  .card-body {
    padding: 24px 20px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.75rem;
  }

  .header-section {
    margin-bottom: 40px;
  }

  .card-header {
    padding: 32px 16px;
  }

  .logo-container {
    width: 100px;
    height: 100px;
  }

  .company-name {
    font-size: 1.2rem;
  }

  .btn-details {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
}
</style>
