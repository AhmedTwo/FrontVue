<script setup>
import ImagesPortal from '../assets/images/Portal.png'

import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const error = ref(null)
const success = ref(false)

const userData = ref({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  telephone: '',
  ville: '',
  code_postal: '',
  qualification: '',
  preference: [],
  disponibilite: '',
  photo: null,
  cv_pdf: null,
})

const handlePhotoUpload = (event) => {
  // On vérifie d'abord si des fichiers ont été sélectionnés ('event.target.files' existe).
  // Si oui, on prend le premier fichier de la liste : [0].
  // Si non (par exemple, si l'utilisateur annule), on assigne 'null'.
  const file = event.target.files ? event.target.files[0] : null
  // On assigne le fichier récupéré à la propriété 'photo'
  userData.value.photo = file
  // console.log("Fichier stocké :", userData.value.photo)
}

const handleCVUpload = (event) => {
  const file = event.target.files ? event.target.files[0] : null
  // On assigne le fichier récupéré à la propriété 'photo'
  userData.value.cv_pdf = file
}

//  fonction d'ajout (POST)
const addUser = async () => {
  loading.value = true
  error.value = null

  // CRÉATION DE FORMDATA pour envoyer du texte ET le fichier
  const formData = new FormData()

  formData.append('nom', userData.value.nom)
  formData.append('prenom', userData.value.prenom)
  formData.append('email', userData.value.email)
  formData.append('password', userData.value.password)
  formData.append('telephone', userData.value.telephone)
  formData.append('ville', userData.value.ville)
  formData.append('code_postal', userData.value.code_postal)
  formData.append('qualification', userData.value.qualification)

  // Les préférences sont jointes en chaîne de caractères
  formData.append('preference', userData.value.preference.join(', '))

  formData.append('disponibilite', userData.value.disponibilite)

  // Ajout du fichier photo s'il existe
  if (userData.value.photo) {
    // Le nom 'photo' doit correspondre à ce que votre API backend attend
    formData.append('photo', userData.value.photo)
  }

  // Ajout du fichier cv s'il existe
  if (userData.value.cv_pdf) {
    // Le nom 'cv_pdf' doit correspondre à ce que votre API backend attend
    formData.append('cv_pdf', userData.value.cv_pdf)
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/addUser', formData, {})

    success.value = true
    console.log('Utilisateur ajouté:', response.data)

    // redirection après succès
    setTimeout(() => {
      router.push('/SignIn')
    }, 1000)
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", err.response?.data || err)
    // erreur retournée par le serveur si elle existe
    error.value = err.response?.data?.message || "Échec de l'ajout. Vérifiez les champs."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="containerFirst">
    <div id="containerSecond">
      <h1 class="h1Add">
        INSCRIPTION &nbsp;&nbsp;
        <img :src="ImagesPortal" alt="fond logo porte de portal job" width="35" />
      </h1>

      <form id="addForm" @submit.prevent="addUser">
        <div class="divAdd">
          <label for="nom">Nom</label>
          <input type="text" id="nom" v-model="userData.nom" required />
        </div>

        <div class="divAdd">
          <label for="prenom">Prénom</label>
          <input type="text" id="prenom" v-model="userData.prenom" required />
        </div>

        <div class="divAdd">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="userData.email" required />
        </div>

        <div class="divAdd">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="userData.password" required />
        </div>

        <div class="divAdd">
          <label for="telephone">Téléphone</label>
          <input type="text" id="telephone" v-model="userData.telephone" required />
        </div>

        <div class="divAdd">
          <label for="ville">Ville</label>
          <input type="text" id="ville" v-model="userData.ville" required />
        </div>

        <div class="divAdd">
          <label for="zipcode">Code postal</label>
          <input type="text" id="zipcode" v-model="userData.code_postal" required />
        </div>

        <div class="divAdd">
          <label for="qualification">Qualification</label>
          <input type="text" id="qualification" v-model="userData.qualification" required />
        </div>

        <div class="divAdd">
          <label for="preference">Préférences (Choix multiples) :</label>

          <div class="checkbox-group">
            <label> <input type="checkbox" value="CDI" v-model="userData.preference" /> CDI </label>
            <label> <input type="checkbox" value="CDD" v-model="userData.preference" /> CDD </label>
            <label>
              <input type="checkbox" value="STAGE" v-model="userData.preference" /> STAGE
            </label>
            <label>
              <input type="checkbox" value="ALTERNANCE" v-model="userData.preference" /> ALTERNANCE
            </label>
            <label>
              <input type="checkbox" value="FREELANCE" v-model="userData.preference" /> FREELANCE
            </label>
          </div>
        </div>

        <div class="divAdd radio-box">
          <p>Disponibilité immédiate :</p>
          <label
            ><input type="radio" name="choix" value="1" required v-model="userData.disponibilite" />
            Oui</label
          >
          <label
            ><input type="radio" name="choix" value="0" required v-model="userData.disponibilite" />
            Non</label
          >
        </div>

        <div class="divAdd">
          <label for="photo">Photo de profil</label>
          <input type="file" id="photo" accept="image/*" @change="handlePhotoUpload" />
        </div>

        <div class="divAdd">
          <label for="cv_pdf">CV (PDF)</label>
          <input type="file" id="cv_pdf" accept="application/pdf" @change="handleCVUpload" />
        </div>

        <div v-if="error" class="divAdd message error-message">❌ {{ error }}</div>
        <div v-if="success" class="divAdd message success-message">
          ✅ Utilisateur ajouté avec succès !
        </div>

        <button type="submit" class="btn" :disabled="loading">
          <span v-if="loading">Ajout en cours...</span>
          <span v-else>Ajouter l'utilisateur</span>
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
/* Ombre carte: 0 8px 15px rgba(0, 0, 0, 0.08) */

/* -------------------
   CONTENEUR GLOBAL
   ------------------- */

#containerFirst {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 55px 0; /* Réduction du padding général */
}

/* -------------------
   CARTE DU FORMULAIRE COMPACT
   ------------------- */

#containerSecond {
  background-color: #ffffff;
  padding: 25px; /* Réduction du padding de la carte */
  border: none;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08); /* Ombre plus légère */
  width: 90%;
  max-width: 800px; /* Légère réduction de la largeur max */
}

/* Titre */
.h1Add {
  text-align: center;
  font-size: 2rem; /* Réduction de la taille du titre */
  color: #212529;
  font-weight: 700;
  margin-bottom: 20px; /* Réduction de la marge */
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef; /* Bordure plus fine */
}

/* -------------------
   GRILLE DU FORMULAIRE (2 COLONNES)
   ------------------- */

#addForm {
  display: flex;
  flex-wrap: wrap;
  gap: 15px; /* Réduction du gap entre les champs */
  justify-content: space-between;
}

.divAdd {
  /* Assure 2 colonnes sur desktop */
  flex: 1 1 calc(50% - 7.5px); /* Calcul adapté au nouveau gap */
  display: flex;
  flex-direction: column;
}

.divAdd label {
  font-weight: 600;
  margin-bottom: 5px; /* Forte réduction de la marge du label */
  color: #212529;
  font-size: 0.9rem; /* Réduction de la taille du label */
}

.divAdd input[type='text'],
.divAdd input[type='email'],
.divAdd input[type='password'],
.divAdd input[type='file'] {
  padding: 8px 10px; /* Forte réduction du padding des inputs */
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.95rem; /* Réduction de la taille du texte dans l'input */
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.divAdd input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2); /* Ombre de focus plus petite */
  outline: none;
}

/* -------------------
   ÉLÉMENTS PLEINE LARGEUR
   ------------------- */

.divAdd.radio-box,
.btn {
  flex: 1 1 100%;
}

/* Gestion spécifique des labels pour les champs de fichiers (pour éviter qu'ils ne débordent) */
.divAdd:last-of-type {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.divAdd:last-of-type label {
  margin-bottom: 0;
  flex-shrink: 0;
}

.divAdd:last-of-type input[type='file'] {
  flex-grow: 1;
  border: none;
  padding: 0;
}

/* Style de la boîte radio */
.radio-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 5px 0;
}

.radio-box p {
  font-weight: 00;
  margin: 0;
  color: #212529;
  font-size: 0.9rem;
}

.radio-box label {
  display: flex;
  cursor: pointer;
  font-size: 1rem;
}

.radio-box input[type='radio'] {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

/* ... (dans <style scoped>) */

.checkbox-group {
  /* Afficher les options en ligne ou en grille */
  display: flex;
  flex-wrap: wrap; /* Permet de passer à la ligne si l'écran est trop petit */
  gap: 15px; /* Espacement entre les options */
  margin-top: 5px;
}

.checkbox-group label {
  /* Style pour chaque option (texte + case) */
  font-weight: normal; /* Annuler le poids de 600 hérité de .divAdd label */
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0; /* Important pour le gap */
  font-size: 0.9rem;
}

.checkbox-group input[type='checkbox'] {
  /* Style pour la case elle-même */
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border: 1px solid #ced4da;
  border-radius: 3px;
  cursor: pointer;
}

/* -------------------
   RESPONSIVE (Ajustements)
   ------------------- */
/* S'assurer que le divAdd des préférences est en pleine largeur si nécessaire */
/* Vous n'avez normalement rien à changer dans la media query pour les .divAdd, 
   mais assurez-vous que les cases à cocher se comportent bien sur mobile. */

@media (max-width: 600px) {
  .checkbox-group {
    flex-direction: column; /* Empiler les cases à cocher sur les petits écrans */
    gap: 8px;
  }
}

/* -------------------
   BOUTON
   ------------------- */

.btn {
  padding: 10px; /* Réduction du padding du bouton */
  font-size: 1rem; /* Réduction de la taille du bouton */
  font-weight: 700;
  transition: background-color 0.3s ease;
  border: none;
  border-radius: 8px; /* Coins légèrement moins arrondis */
  color: white;
  background-color: #0d6efd;
  box-shadow: 0 3px 8px rgba(13, 110, 253, 0.2);
  margin-top: 10px; /* Réduction de la marge au-dessus du bouton */
}

.btn:hover {
  background-color: #0b5ed7;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
  transform: none; /* Supprimer la translation pour un look plus plat et compact */
}

/* -------------------
   RESPONSIVE (Ajustements compressés)
   ------------------- */

@media (max-width: 850px) {
  /* La grille bascule en une seule colonne sur les écrans de taille moyenne */
  .divAdd {
    flex: 1 1 100%;
  }
}

@media (max-width: 600px) {
  #containerSecond {
    padding: 20px;
    max-width: 95%;
  }

  .h1Add {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }

  .divAdd:last-of-type {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .divAdd:last-of-type label {
    width: 100%;
    margin-bottom: 0;
  }

  .radio-box {
    flex-wrap: wrap;
  }
}
</style>
