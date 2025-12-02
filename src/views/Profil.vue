<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const token = localStorage.getItem('auth_token')

// on change le nom de la variable pour stocker un seul objet
const user = ref(null)

const readCompany = async () => {
  const userId = userStore.user.id

  if (!userId) {
    console.error('ID de user non trouvé dans les paramètres de la route.')
    return
  }

  try {
    // on apl l'endpoint spécifique par ID (selon votre API Laravel)
    const responses = await axios.get(`http://127.0.0.1:8000/api/userById/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // on stock l'objet unique dans la variable 'user'
    user.value = responses.data.data
    console.log(user.value)
  } catch (err) {
    console.log('Erreur lors de la récupération des détails de user par ID :', err)
  }
}

onMounted(readCompany)
</script>

<template>
  <div class="page-background-profil" v-if="user">
    <div class="photo-edit-zone">
      <p class="user-qualification">{{ user.qualification }}</p>
      <img
        class="profil-photo"
        :src="'http://127.0.0.1:8000/storage/' + user.photo"
        alt="Photo de profil"
      />
      <a href="/Profil/UpdateProfil" class="btn-edit-float" title="Modifier le profil">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-2.67 0-8 1.34-8 4v2h8.5l1.5-1.5V14zM20.7 14.35l-1.05-1.05c-.2-.2-.51-.2-.71 0l-4.34 4.34V20h2.36l4.34-4.34c.19-.2.19-.51 0-.71z"
          />
        </svg>
      </a>
    </div>
    <div class="profil-container">
      <div class="profil-info">
        <hr class="separator" />

        <div class="info-group">
          <p class="info-item">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                fill="currentColor"
              />
            </svg>
            <span>Email :</span>
            <a href="mailto:seghiriahmed9@gmail.com" class="info-value email-link">{{
              user.email
            }}</a>
          </p>

          <p class="info-item">
            <svg
              class="info-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7h-1V7a5 5 0 0 0-10 0v3H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2zm-7-3a3 3 0 0 1 6 0v3h-6V7zm7 14H6v-9h12v9z"
              />
            </svg>
            <span>Mot de passe :</span>
            <span style="font-weight: 900" class="info-value">**********</span>
          </p>

          <p class="info-item">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.46.57 3.57.12.35.03.74-.25 1.02l-2.2 2.2z"
                fill="currentColor"
              />
            </svg>
            <span>Téléphone :</span>
            <span class="info-value">{{ user.telephone }}</span>
          </p>
          <p class="info-item">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="currentColor"
              />
            </svg>
            <span>Ville :</span>
            <span class="info-value">{{ user.ville }} ({{ user.code_postal }})</span>
          </p>
        </div>

        <hr class="separator" />

        <div class="status-group">
          <p class="info-item">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                fill="currentColor"
              />
            </svg>
            <span>CV :</span>
            <a href="#" target="_blank" class="cv-link">Télécharger</a>
          </p>
          <p class="info-item status-display">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                fill="currentColor"
              />
            </svg>
            <span>Disponible :</span>
            <span class="status-badge badge-unavailable">{{ user.disponibilite }}</span>
          </p>
          <p class="info-item status-display">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="currentColor"
              />
            </svg>
            <span>Rôle :</span>
            <span class="status-badge badge-admin">{{ user.role }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 🎨 PALETTE MODERNE */
:root {
  --primary: #4f46e5;
  --primary-light: #818cf8;
  --primary-dark: #3730a3;
  --secondary: #06b6d4;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --bg-gradient-start: #f0f9ff;
  --bg-gradient-end: #e0e7ff;
  --card-bg: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 15px rgba(79, 70, 229, 0.1);
  --shadow-lg: 0 20px 50px rgba(79, 70, 229, 0.15);
  --shadow-glow: 0 0 30px rgba(79, 70, 229, 0.3);
}

/* 🌐 CONTENEUR GLOBAL AVEC GRADIENT ANIMÉ */
.page-background-profil {
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.page-background-profil::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgb(100, 167, 255) 30%, transparent 70%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

/* 📦 CARTE PROFIL MODERNE */
.profil-container {
  background: rgba(128, 128, 128, 0.103);
  border-radius: 24px;
  padding: 5px 20px;
  width: 100%;
  max-width: 650px;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.profil-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--primary) 100%);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
  border-radius: 24px 24px 0 0;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.profil-container:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: var(--shadow-glow);
}

/* 👤 PHOTO DE PROFIL AVEC EFFET GLASSMORPHISM */
.photo-edit-zone {
  position: relative;
  display: inline-block;
  margin-bottom: 30px;
}

.photo-edit-zone::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--primary), var(--secondary), var(--primary));
  background-size: 200% 200%;
  animation: rotate-gradient 4s linear infinite;
  z-index: -1;
}

@keyframes rotate-gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.profil-photo {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid var(--card-bg);
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1.05) contrast(1.1);
}

.profil-photo:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 12px 48px rgba(79, 70, 229, 0.5);
}

/* ✏️ BOUTON ÉDITION MODERNISÉ */
.btn-edit-float {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  z-index: 10;
}

.btn-edit-float:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  transform: scale(1.2) rotate(15deg);
  box-shadow: 0 6px 25px rgba(79, 70, 229, 0.6);
}

.btn-edit-float svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.btn-edit-float:hover svg {
  transform: rotate(-15deg);
}

/* 📋 INFORMATIONS UTILISATEUR */
.profil-info {
  text-align: left;
}

.user-qualification {
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
}

.user-qualification::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  border-radius: 2px;
}

.separator {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-light), transparent);
  margin: 30px 0;
  opacity: 0.3;
}

/* 📱 GROUPES D'INFORMATIONS */
.info-group,
.status-group {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.info-item {
  font-size: 1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--primary), var(--secondary));
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.info-item:hover {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  transform: translateX(5px);
  box-shadow: var(--shadow-md);
}

.info-item:hover::before {
  transform: scaleY(1);
}

.info-item span:first-of-type {
  font-weight: 700;
  color: var(--text-secondary);
  min-width: 110px;
  margin-right: 12px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

/* 🔗 LIEN EMAIL */
.email-link {
  color: var(--primary);
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;
}

.email-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.3s ease;
}

.email-link:hover {
  color: var(--primary-dark);
}

.email-link:hover::after {
  width: 100%;
}

/* 📱 ICÔNES MODERNISÉES */
.info-icon {
  width: 22px;
  height: 22px;
  margin-right: 12px;
  color: var(--primary);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.info-item:hover .info-icon {
  transform: scale(1.2) rotate(5deg);
  color: var(--secondary);
}

/* 🔗 LIEN CV AVEC EFFET */
.cv-link {
  color: var(--success);
  font-weight: 700;
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.596);
  transition: all 0.3s ease;
  display: inline-block;
}

.cv-link:hover {
  background: var(--success);
  color: black;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.959);
}

/* 🏷️ BADGES MODERNES */
.status-group {
  margin-top: 30px;
  padding-top: 25px;
  border-top: 1px solid rgba(79, 70, 229, 0.1);
}

.status-display {
  justify-content: space-between;
}

.status-badge {
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.status-badge::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.4s ease,
    height 0.4s ease;
}

.status-badge:hover::before {
  width: 200px;
  height: 200px;
}

.badge-admin {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
}

.badge-unavailable {
  background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
  color: black;
}

.badge-available {
  background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
  color: black;
}

.status-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* ✨ ANIMATIONS SUPPLÉMENTAIRES */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.info-item {
  animation: slideIn 0.6s ease-out backwards;
}

.info-item:nth-child(1) {
  animation-delay: 0.1s;
}
.info-item:nth-child(2) {
  animation-delay: 0.2s;
}
.info-item:nth-child(3) {
  animation-delay: 0.3s;
}
.info-item:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ========================================
   📱 RESPONSIVE DESIGN COMPLET
   ======================================== */

/* Tablettes et écrans moyens (max 1024px) */
@media (max-width: 1024px) {
  .page-background-profil {
    padding: 30px 15px;
  }

  .profil-container {
    max-width: 580px;
    padding: 40px 25px;
  }

  .profil-photo {
    width: 130px;
    height: 130px;
  }

  .user-qualification {
    font-size: 1.05rem;
  }

  .info-item {
    padding: 10px 14px;
  }

  .info-item span:first-of-type {
    min-width: 100px;
    font-size: 0.85rem;
  }
}

/* Tablettes portrait (max 768px) */
@media (max-width: 768px) {
  .page-background-profil {
    padding: 25px 12px;
    align-items: flex-start;
    padding-top: 40px;
  }

  .page-background-profil::before {
    animation: float 25s ease-in-out infinite;
  }

  .profil-container {
    padding: 35px 20px;
    border-radius: 20px;
    max-width: 100%;
  }

  .profil-container:hover {
    transform: translateY(-5px) scale(1.01);
  }

  .profil-photo {
    width: 120px;
    height: 120px;
    border: 5px solid var(--card-bg);
  }

  .photo-edit-zone::before {
    inset: -6px;
  }

  .btn-edit-float {
    width: 40px;
    height: 40px;
    bottom: 3px;
    right: 3px;
  }

  .btn-edit-float svg {
    width: 18px;
    height: 18px;
  }

  .user-qualification {
    font-size: 1rem;
    margin-bottom: 25px;
  }

  .separator {
    margin: 25px 0;
  }

  /* Info items en colonne sur mobile */
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 14px;
    gap: 6px;
  }

  .info-item span:first-of-type {
    min-width: unset;
    margin-right: 0;
    margin-bottom: 4px;
    font-size: 0.8rem;
  }

  .info-value {
    font-size: 0.95rem;
    padding-left: 0;
  }

  .info-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .info-item:hover {
    transform: translateX(3px);
  }

  /* Status badges adaptés */
  .status-group {
    margin-top: 25px;
    padding-top: 20px;
    gap: 12px;
  }

  .status-badge {
    padding: 7px 14px;
    font-size: 0.7rem;
    letter-spacing: 0.8px;
  }

  /* CV Link ajusté */
  .cv-link {
    padding: 5px 12px;
    font-size: 0.9rem;
  }
}

/* Mobile (max 480px) */
@media (max-width: 480px) {
  .page-background-profil {
    padding: 20px 10px;
    padding-top: 30px;
    min-height: auto;
  }

  .profil-container {
    padding: 25px 16px;
    border-radius: 18px;
  }

  .profil-container::before {
    height: 4px;
  }

  .profil-container:hover {
    transform: translateY(-3px) scale(1);
  }

  .profil-photo {
    width: 100px;
    height: 100px;
    border: 4px solid var(--card-bg);
  }

  .photo-edit-zone {
    margin-bottom: 20px;
  }

  .photo-edit-zone::before {
    inset: -5px;
  }

  .btn-edit-float {
    width: 36px;
    height: 36px;
    bottom: 2px;
    right: 2px;
  }

  .btn-edit-float svg {
    width: 16px;
    height: 16px;
  }

  .user-qualification {
    font-size: 0.95rem;
    margin-bottom: 20px;
    padding-bottom: 12px;
  }

  .user-qualification::after {
    width: 50px;
    height: 2px;
  }

  .separator {
    margin: 20px 0;
  }

  .info-group {
    gap: 12px;
  }

  .info-item {
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 0.9rem;
  }

  .info-item span:first-of-type {
    font-size: 0.75rem;
  }

  .info-value {
    font-size: 0.9rem;
  }

  .info-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }

  .email-link {
    word-break: break-all;
    font-size: 0.85rem;
  }

  .cv-link {
    padding: 4px 10px;
    font-size: 0.85rem;
    border-radius: 6px;
  }

  .status-group {
    margin-top: 20px;
    padding-top: 15px;
    gap: 10px;
  }

  .status-display {
    flex-direction: column;
    gap: 8px;
  }

  .status-badge {
    padding: 6px 12px;
    font-size: 0.65rem;
    letter-spacing: 0.6px;
    text-align: center;
  }

  /* Animations réduites sur mobile */
  .info-item {
    animation: slideIn 0.4s ease-out backwards;
  }
}

/* Très petits mobiles (max 360px) */
@media (max-width: 360px) {
  .page-background-profil {
    padding: 15px 8px;
    padding-top: 25px;
  }

  .profil-container {
    padding: 20px 12px;
    border-radius: 16px;
  }

  .profil-photo {
    width: 90px;
    height: 90px;
    border: 3px solid var(--card-bg);
  }

  .photo-edit-zone {
    margin-bottom: 15px;
  }

  .btn-edit-float {
    width: 32px;
    height: 32px;
  }

  .btn-edit-float svg {
    width: 14px;
    height: 14px;
  }

  .user-qualification {
    font-size: 0.9rem;
    margin-bottom: 15px;
  }

  .info-item {
    padding: 8px 10px;
    font-size: 0.85rem;
  }

  .info-item span:first-of-type {
    font-size: 0.7rem;
  }

  .info-value {
    font-size: 0.85rem;
  }

  .info-icon {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }

  .status-badge {
    padding: 5px 10px;
    font-size: 0.6rem;
  }

  .cv-link {
    font-size: 0.8rem;
    padding: 3px 8px;
  }
}

/* Orientation paysage mobile */
@media (max-height: 600px) and (orientation: landscape) {
  .page-background-profil {
    padding: 15px 10px;
    align-items: flex-start;
  }

  .profil-container {
    margin: 0 auto;
  }

  .profil-photo {
    width: 80px;
    height: 80px;
  }

  .photo-edit-zone {
    margin-bottom: 15px;
  }

  .user-qualification {
    margin-bottom: 15px;
  }

  .separator {
    margin: 15px 0;
  }

  .info-group {
    gap: 10px;
  }

  .status-group {
    margin-top: 15px;
    padding-top: 15px;
  }
}

/* Désactivation des effets de survol sur tactile */
@media (hover: none) and (pointer: coarse) {
  .profil-container:hover {
    transform: none;
    box-shadow: var(--shadow-lg);
  }

  .profil-photo:hover {
    transform: none;
  }

  .info-item:hover {
    transform: none;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .info-item:hover .info-icon {
    transform: none;
  }

  .btn-edit-float:hover {
    transform: none;
  }

  .status-badge:hover {
    transform: none;
  }
}
</style>
