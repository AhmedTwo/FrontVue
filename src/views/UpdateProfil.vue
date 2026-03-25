<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const apiUrl = import.meta.env.VITE_API_URL

const profilId = userStore.user.id
const isLoading = ref(true)

const profil = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  ville: '',
  code_postal: '',
  qualification: '',
  disponibilite: '',
  photo: '',
  cv_pdf: '',
})

const newPhoto = ref(null)
const photoPreview = ref(null)

const newCV = ref(null)
const CvPreview = ref(null)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const loadProfil = async () => {
  const token = localStorage.getItem('auth_token')

  try {
    const response = await axios.get(`${apiUrl}/api/userById/${profilId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Détecte automatiquement si les données sont dans "data" ou pas
    const data = response.data.data ? response.data.data : response.data

    profil.value = {
      ...profil.value,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      ville: data.ville,
      code_postal: data.code_postal,
      qualification: data.qualification,
      disponibilite: !!data.disponibilite,
      photo: data.photo,
      cv_pdf: data.cv_pdf,
    }

    // si une photo existe, on prépare l'aperçu
    if (data.photo) {
      photoPreview.value = `${apiUrl}/storage/${data.photo}`
    }
    // si un cv existe, on prépare l'aperçu
    if (data.cv_pdf) {
      CvPreview.value = `${apiUrl}/storage/${data.cv_pdf}`
    }
  } catch (error) {
    console.error('Erreur lors du chargement du Profil :', error)
    alert('Impossible de charger le profil à modifier.')
  } finally {
    isLoading.value = false
  }
}

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    newPhoto.value = file
    photoPreview.value = URL.createObjectURL(file)
  }
}

const handleCvChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    newCV.value = file
    CvPreview.value = URL.createObjectURL(file)
  }
}

const updateProfil = async () => {
  const token = localStorage.getItem('auth_token')
  const formData = new FormData()

  formData.append('_method', 'PUT')

  formData.append('nom', profil.value.nom)
  formData.append('prenom', profil.value.prenom)
  formData.append('email', profil.value.email)
  formData.append('telephone', profil.value.telephone)
  formData.append('ville', profil.value.ville)
  formData.append('code_postal', profil.value.code_postal)
  formData.append('qualification', profil.value.qualification)
  formData.append('disponibilite', profil.value.disponibilite ? 1 : 0)

  // MDP actuel
  if (currentPassword.value) {
    formData.append('current_password', currentPassword.value)
  }

  // Nouveau mot de passe + confirmation
  if (newPassword.value) {
    formData.append('new_password', newPassword.value)
    formData.append('new_password_confirmation', confirmPassword.value)
  }

  // si une nouvelle photo a été sélectionnée
  if (newPhoto.value) {
    formData.append('photo', newPhoto.value)
  }

  // si une nouveau cv a été sélectionné
  if (newCV.value) {
    formData.append('cv_pdf', newCV.value)
  }

  try {
    await axios.post(`${apiUrl}/api/userUpdate/${profilId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    alert('✅ Profil mis à jour avec succès')
    router.back() // retourne vers la page precedente
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error)
    alert('❌ Erreur lors de la mise à jour du Profil.')
  }
}

onMounted(loadProfil)
</script>

<template>
  <div class="page-background">
    <div class="update-profil-container">
      <h2 class="form-header">Modifier mon Profil</h2>

      <div v-if="isLoading" style="text-align: center; padding: 40px">Chargement...</div>

      <form v-else class="profil-form" @submit.prevent="updateProfil">
        <div class="photo-upload-section">
          <div class="photo-preview-wrapper">
            <img
              v-if="photoPreview"
              :src="photoPreview"
              alt="Photo de profil"
              class="profil-photo-preview"
            />
            <div v-else class="no-photo">Aucune photo</div>
          </div>

          <label class="btn-change-photo">
            Changer la photo
            <input type="file" accept="image/*" @change="handlePhotoChange" hidden />
          </label>
        </div>

        <hr class="separator" />

        <div class="form-row">
          <div class="form-group">
            <label for="Nom">Nom </label>
            <input id="Nom" type="text" v-model="profil.nom" required />
          </div>
          <div class="form-group">
            <label for="prenom">Nom </label>
            <input id="prenom" type="text" v-model="profil.prenom" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" v-model="profil.email" required />
          </div>
          <div class="form-group">
            <label for="current_password">Mot de passe actuel</label>
            <input id="current_password" type="password" v-model="currentPassword" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="new_password">Nouveau mot de passe</label>
            <input id="new_password" type="password" v-model="newPassword" />
          </div>
          <div class="form-group">
            <label for="confirm_password">Confirmer le nouveau mot de passe</label>
            <input id="confirm_password" type="password" v-model="confirmPassword" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="telephone">Téléphone</label>
            <input id="telephone" type="tel" v-model="profil.telephone" />
          </div>
          <div class="form-group">
            <label for="ville">Ville</label>
            <input id="ville" type="text" v-model="profil.ville" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="code_postal">Code Postale</label>
            <input id="code_postal" type="text" v-model="profil.code_postal" />
          </div>
          <div class="form-group">
            <label for="qualification">Qualification / Poste</label>
            <input id="qualification" type="text" v-model="profil.qualification" />
          </div>
        </div>

        <hr class="separator" />

        <div class="photo-upload-section">
          <div v-if="CvPreview">
            <a :href="CvPreview" target="_blank">👉 Clique ici pour voir ton fichier (CV) 👈 </a>
          </div>
          <div v-else class="no-photo">Aucun CV</div>
          <br />
          <label class="btn-change-photo">
            Changer le CV
            <input type="file" accept=".pdf" @change="handleCvChange" hidden />
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label for="disponible">
            <input id="disponible" type="checkbox" v-model="profil.disponibilite" />
            Disponible immédiatement pour de nouvelles opportunités
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-save">Enregistrer les modifications</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 🌐 CONTENEUR GLOBAL */
.page-background {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 50px 20px;
  min-height: 100vh;
  background: #f3f4f6;
}

/* 📦 CONTAINER FORMULAIRE */
.update-profil-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 25px 30px;
  max-width: 650px;
  width: 100%;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.update-profil-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

/* 📝 TITRE FORMULAIRE */
.form-header {
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  color: #374151;
  margin-bottom: 25px;
  position: relative;
}

.form-header::after {
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, #6366f1, #4338ca);
  margin: 10px auto 0;
  border-radius: 2px;
}

/* -------------------
   SECTION PHOTO
   ------------------- */
.photo-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  position: relative;
}

.photo-preview-wrapper {
  width: 140px;
  height: 140px;
  position: relative;
}

.profil-photo-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #2836b3;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  filter: brightness(1.05) contrast(1.05);
}

.profil-photo-preview:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.btn-change-photo {
  background: linear-gradient(135deg, #171bf0, #05031f);
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-change-photo:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #4338ca, #6366f1);
}

/* -------------------
   FORMULAIRE
   ------------------- */
.profil-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: flex;
  gap: 20px; /* espace entre les deux champs */
  flex-wrap: wrap; /* s’adapte aux écrans étroits */
}

.form-row .form-group {
  flex: 1; /* chaque champ prend moitié de la ligne */
  min-width: 200px; /* limite pour mobile */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.form-group input:not([type='checkbox']):not([type='file']) {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* Checkbox */
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
}

.checkbox-group input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: #6366f1;
  cursor: pointer;
}

/* Séparateur */
.separator {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #c7d2fe, transparent);
  opacity: 0.4;
  margin: 20px 0;
}

/* -------------------
   BOUTONS
   ------------------- */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.btn-save {
  background: linear-gradient(135deg, #6366f1, #4338ca);
  color: #fff;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(67, 56, 202, 0.3);
  width: 100%;
  text-align: center;
}

.btn-save:hover {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(67, 56, 202, 0.45);
}

/* -------------------
   ANIMATIONS
   ------------------- */
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

.profil-form .form-group {
  animation: slideIn 0.6s ease-out backwards;
}

/* -------------------
   RESPONSIVE
   ------------------- */
@media (max-width: 1024px) {
  .update-profil-container {
    padding: 20px 25px;
    max-width: 580px;
  }

  .profil-photo-preview {
    width: 130px;
    height: 130px;
  }
}

@media (max-width: 768px) {
  .update-profil-container {
    padding: 20px 20px;
    max-width: 100%;
  }

  .profil-photo-preview {
    width: 120px;
    height: 120px;
  }

  .form-group input:not([type='checkbox']):not([type='file']) {
    padding: 9px 12px;
  }

  .btn-save {
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  .update-profil-container {
    padding: 18px 15px;
  }

  .profil-photo-preview {
    width: 100px;
    height: 100px;
  }

  .btn-change-photo {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  .form-group input:not([type='checkbox']):not([type='file']) {
    padding: 8px 10px;
    font-size: 0.9rem;
  }

  .btn-save {
    font-size: 0.95rem;
    padding: 10px 18px;
  }
}
</style>
