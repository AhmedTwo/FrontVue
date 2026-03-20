<script setup>
// Importation des fonctions de l'API Composition de Vue 3
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// --- CONFIGURATION API ---
// On centralise l'URL ici pour éviter l'erreur de build Vercel dans le template ou les fonctions
const apiUrl = import.meta.env.VITE_API_URL

const router = useRouter()

const loading = ref(false)
const error = ref(null)
const success = ref(false)

const companyData = ref({
  name: '',
  number_of_employees: null,
  industry: '',
  address: '',
  latitude: null,
  longitude: null,
  description: '',
  email_company: '',
  n_siret: '',
  logo: null,
})

const userData = ref({
  nom: '',
  prenom: '',
  telephone: '',
  ville: '',
  code_postal: '',
  photo: null,
})

const handlePhotoUpload = (event) => {
  const file = event.target.files ? event.target.files[0] : null
  userData.value.photo = file
}

const handleLogoUpload = (event) => {
  const file = event.target.files ? event.target.files[0] : null
  companyData.value.logo = file
}

const generateRandomPassword = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

const submitForm = async () => {
  if (companyData.value.n_siret.length !== 14) {
    error.value = 'Le numéro SIRET doit contenir exactement 14 chiffres.'
    return
  }

  loading.value = true
  error.value = null
  success.value = false

  let autoEmail = ''
  let autoPassword = ''
  let newCompanyId = null

  try {
    // ÉTAPE 1 : AJOUT DE LA SOCIÉTÉ
    const companyFormData = new FormData()
    companyFormData.append('name', companyData.value.name)
    companyFormData.append('number_of_employees', companyData.value.number_of_employees || '')
    companyFormData.append('industry', companyData.value.industry)
    companyFormData.append('address', companyData.value.address)
    companyFormData.append('latitude', companyData.value.latitude || '')
    companyFormData.append('longitude', companyData.value.longitude || '')
    companyFormData.append('description', companyData.value.description)
    companyFormData.append('email_company', companyData.value.email_company)
    companyFormData.append('n_siret', companyData.value.n_siret)

    if (companyData.value.logo) {
      companyFormData.append('logo', companyData.value.logo)
    } else {
      companyFormData.append('logo', '')
    }

    const companyResponse = await axios.post(`${apiUrl}/api/addCompany`, companyFormData)

    newCompanyId = companyResponse.data.data.id

    if (!newCompanyId) {
      throw new Error("L'API n'a pas retourné l'ID de la société créée.")
    }

    // ÉTAPE 2 : AJOUT DE L'UTILISATEUR
    const slugName = companyData.value.name.toLowerCase().replace(/\s/g, '-')
    autoEmail = `${slugName}@company.com`
    autoPassword = generateRandomPassword(8)

    const userFormData = new FormData()
    userFormData.append('nom', userData.value.nom)
    userFormData.append('prenom', userData.value.prenom)
    userFormData.append('telephone', userData.value.telephone)
    userFormData.append('ville', userData.value.ville)
    userFormData.append('code_postal', userData.value.code_postal)
    userFormData.append('company_id', newCompanyId)
    userFormData.append('email', autoEmail)
    userFormData.append('password', autoPassword)
    userFormData.append('disponibilite', 0)

    if (userData.value.photo) {
      userFormData.append('photo', userData.value.photo)
    }

    await axios.post(`${apiUrl}/api/addUser`, userFormData)

    // ÉTAPE 3 : ENVOI DES IDENTIFIANTS
    const emailPayload = {
      company_name: companyData.value.name,
      company_email: companyData.value.email_company,
      user_login_email: autoEmail,
      user_raw_password: autoPassword,
      user_full_name: `${userData.value.prenom} ${userData.value.nom}`,
    }

    await axios.post(`${apiUrl}/api/send-identifiants-company`, emailPayload)

    success.value = true
    setTimeout(() => {
      router.push('/SignIn')
    }, 1000)
  } catch (err) {
    console.error('Erreur de soumission complète:', err)
    if (err.response) {
      const status = err.response.status
      const data = err.response.data
      if (status === 422 && data.errors) {
        error.value = 'Erreur de validation. Veuillez vérifier tous les champs.'
      } else {
        error.value = data.message || `Erreur serveur (Code ${status}).`
      }
    } else {
      error.value = err.message || 'Erreur de connexion réseau.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="containerFirst">
    <div id="containerSecond">
      <h1 class="h1AddCompany">AJOUT D'UNE NOUVELLE SOCIÉTÉ !</h1>

      <form id="addCompanyForm" @submit.prevent="submitForm">
        <div class="divAdd">
          <label for="inputNom">NOM (SOCIÉTÉ)</label>
          <input type="text" id="inputNom" v-model="companyData.name" required />
        </div>

        <div class="divAdd">
          <label for="inputNbEmploye">NOMBRE EMPLOYEES (SOCIÉTÉ)</label>
          <input
            type="number"
            id="inputNbEmploye"
            v-model.number="companyData.number_of_employees"
            required
          />
        </div>

        <div class="divAdd">
          <label for="inputDomaine">DOMAINE (SOCIÉTÉ)</label>
          <input type="text" id="inputDomaine" v-model="companyData.industry" required />
        </div>

        <div class="divAdd">
          <label for="inputAdresse">ADRESSE POSTALE SOCIETE (SOCIÉTÉ)</label>
          <input type="text" id="inputAdresse" v-model="companyData.address" required />
        </div>

        <div class="divAdd">
          <label for="inputLatitutde">LATITUDE (SOCIÉTÉ)</label>
          <input type="text" id="inputLatitutde" v-model="companyData.latitude" required />
        </div>

        <div class="divAdd">
          <label for="inputLongitude">LONGITUDE (SOCIÉTÉ)</label>
          <input type="text" id="inputLongitude" v-model="companyData.longitude" required />
        </div>

        <div class="divAdd">
          <label for="inputDescription">DESCRIPTIF (SOCIÉTÉ)</label>
          <input type="text" id="inputDescription" v-model="companyData.description" required />
        </div>

        <div class="divAdd">
          <label for="inputEmail">EMAIL (SOCIÉTÉ)</label>
          <input type="email" id="inputEmail" v-model="companyData.email_company" required />
        </div>

        <div class="divAdd">
          <label for="inputSiret">N_SIRET (SOCIÉTÉ)</label>
          <input
            type="text"
            id="inputSiret"
            v-model="companyData.n_siret"
            inputmode="numeric"
            pattern="\d{14}"
            maxlength="14"
            required
          />
        </div>

        <div class="divAdd">
          <label for="inputLogo">LOGO (SOCIÉTÉ)</label>
          <input type="file" id="inputLogo" accept="image/*" @change="handleLogoUpload" />
        </div>

        <div class="divAdd">
          <label for="inputFirstName">NOM (UTILISATEUR)</label>
          <input type="text" id="inputFirstName" v-model="userData.nom" required />
        </div>

        <div class="divAdd">
          <label for="inputLastName">PRENOM (UTILISATEUR)</label>
          <input type="text" id="inputLastName" v-model="userData.prenom" required />
        </div>

        <div class="divAdd">
          <label for="telephone">TELEPHONE (UTILISATEUR)</label>
          <input type="text" id="telephone" v-model="userData.telephone" required />
        </div>

        <div class="divAdd">
          <label for="ville">VILLE (UTILISATEUR)</label>
          <input type="text" id="ville" v-model="userData.ville" required />
        </div>

        <div class="divAdd">
          <label for="zipcode">CODE POSTAL (UTILISATEUR)</label>
          <input type="text" id="zipcode" v-model="userData.code_postal" required />
        </div>

        <div class="divAdd">
          <label for="photo">Photo (UTILISATEUR)</label>
          <input type="file" id="photo" accept="image/*" @change="handlePhotoUpload" />
        </div>

        <div v-if="error" class="divAdd message error-message">❌ {{ error }}</div>
        <div v-if="success" class="divAdd message success-message">
          ✅ Utilisateur et Société ajoutés !
        </div>

        <button type="submit" class="btn" :disabled="loading">
          <span v-if="loading">Ajout en cours...</span>
          <span v-else>Envoyer</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* COULEURS */
/* Bleu principal: #0d6efd */
/* Couleur de fond de page: #f8f9fa */
/* Couleur de texte: #212529 */
/* Bordure input: #ced4da */
/* Ombre carte: 0 5px 12px rgba(0, 0, 0, 0.05) */

/* -------------------
   CONTENEUR GLOBAL
   ------------------- */

#containerFirst {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 35px 0;
}

/* -------------------
   CARTE DU FORMULAIRE COMPACT
   ------------------- */

#containerSecond {
  background-color: #ffffff;
  padding: 20px; /* Réduction du padding */
  border: none;
  border-radius: 10px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.05); /* Ombre très légère */
  width: 95%;
  max-width: 950px; /* Augmenté légèrement pour étaler les 16 champs */
  margin: 0;
}

/* Titre */
.h1AddCompany {
  text-align: center;
  font-size: 1.8rem; /* Titre plus petit */
  color: #212529;
  font-weight: 700;
  margin-bottom: 15px; /* Réduction de la marge */
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

/* -------------------
   GRILLE DU FORMULAIRE (2 COLONNES)
   ------------------- */

#addCompanyForm {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Très petit gap entre les champs pour économiser de l'espace */
  justify-content: space-between;
}

.divAdd {
  /* Assure 2 colonnes sur desktop */
  flex: 1 1 calc(50% - 5px); /* Calcul adapté au gap de 10px */
  display: flex;
  flex-direction: column;
}

.divAdd label {
  font-weight: 600;
  margin-bottom: 3px; /* Marge minimale */
  color: #212529;
  font-size: 0.85rem; /* Très petit label */
  text-transform: uppercase;
}

.divAdd input {
  padding: 8px 8px; /* Padding minimaliste */
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.divAdd input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
  outline: none;
}

/* -------------------
   ÉLÉMENTS PLEINE LARGEUR
   ------------------- */

/* Le dernier élément (bouton) prend toute la largeur */
.btn {
  flex: 1 1 100%;
}

/* Gestion du champ de fichier (pour qu'il ne soit pas trop haut) */
.divAdd input[type='file'] {
  padding: 6px 8px;
}

/* -------------------
   BOUTON
   ------------------- */

.btn {
  padding: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  border-radius: 6px;
  color: white;
  background-color: #0d6efd;
  box-shadow: 0 2px 5px rgba(13, 110, 253, 0.2);
  margin-top: 15px;
}

.btn:hover {
  background-color: #0b5ed7;
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
}

/* -------------------
   RESPONSIVE (Mode Colonne Ultra-Compact)
   ------------------- */

@media (max-width: 900px) {
  #containerSecond {
    padding: 15px;
    max-width: 85%;
  }

  /* Passage à une seule colonne pour maximiser la hauteur verticale disponible */
  .divAdd {
    flex: 1 1 100%;
  }
}

@media (max-width: 600px) {
  #containerSecond {
    padding: 15px;
    max-width: 75%;
  }

  .h1AddCompany {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
}

@media (max-width: 360px) {
  #containerFirst {
    padding: 15px 5px;
  }

  #containerSecond {
    padding: 12px;
    max-width: 97%;
  }

  .h1AddCompany {
    font-size: 1.3rem;
    margin-bottom: 8px;
    padding-bottom: 6px;
  }

  #addCompanyForm {
    gap: 5px;
  }

  .divAdd label {
    font-size: 0.7rem;
    margin-bottom: 1px;
  }

  .divAdd input {
    padding: 5px 6px;
    font-size: 0.78rem;
  }

  .divAdd input[type='file'] {
    padding: 4px 5px;
    font-size: 0.75rem;
  }

  .btn {
    font-size: 0.88rem;
    padding: 7px;
    margin-top: 7px;
  }
}
</style>
