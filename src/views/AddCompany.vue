<script setup>
// Importation des fonctions de l'API Composition de Vue 3
import { ref } from 'vue' // 'ref' est pour créer des variables réactives
// Importation de la librairie HTTP pour faire des requêtes API
import axios from 'axios'
// Importation de la fonction de navigation pour changer de page après soumission
import { useRouter } from 'vue-router'

// on initialise routeur Vue pour la redirection
const router = useRouter()

// --- État de l'interface utilisateur (variables qui gèrent l'affichage sur le front) ---
const loading = ref(false) // pour indiquer si une soumission est en cours
const error = ref(null) // pour stocker et afficher les messages d'erreur à l'utilisateur
const success = ref(false) // pour indiquer le succès de la soumission complète

// --- Données du formulaire SOCIÉTÉ (Les champs de la société) ---
const companyData = ref({
  // Crée un objet réactif pour stocker les données du formulaire de la société
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

// --- Données du formulaire UTILISATEUR (Administrateur de la société) ---
const userData = ref({
  // Crée un objet réactif pour stocker les données du formulaire de l'administrateur
  nom: '',
  prenom: '',
  telephone: '',
  ville: '',
  code_postal: '',
  photo: null,
  // company_id sera lié après l'étape 1 (l'ID sera récupéré après la création de la société)
})

// Gestion de l'upload de la photo utilisateur
const handlePhotoUpload = (event) => {
  // on déclare une fonction constante/fléchée nommée 'handlePhotoUpload', prenant l'objet d'événement 'event' en paramètre.
  // on recup le premier fichier sélectionné par l'utilisateur (event.target.files)
  const file = event.target.files ? event.target.files[0] : null // condition ternaire :
  // event.target.files : Accès à la liste (FileList) des fichiers sélectionnés dans l'input (le champ du formulaire).
  // "?" Début de la condition ternaire (SI la liste existe)
  // "event.target.files[0]", on prend le premier élément de cette liste (l'objet File) avec l'index [0].
  // ":" SINON (si la liste est nulle ou vide)
  // "null" ALORS, on attribue la valeur 'null' à 'file'.
  userData.value.photo = file // on affecte la valeur de la constante 'file' à la propriété 'photo' de l'objet réactif 'userData'.
  // "userData" : La référence réactive (ref) qui contient toutes les données de l'administrateur.
  // ".value" : Indispensable en Vue 3 (Composition API) pour accéder ou modifier la valeur réelle contenue dans la référence réactive.
  // ".photo" : La clé spécifique dans l'objet 'userData' où nous stockons l'objet File pour l'envoi futur.
}

// Gestion de l'upload du logo de la société
const handleLogoUpload = (event) => {
  // Récupère le premier fichier sélectionné pour le logo
  const file = event.target.files ? event.target.files[0] : null // Affecte l'objet Fichier à la propriété 'logo' de la société
  companyData.value.logo = file
}

// Fonction Utilitaire mdp auto
/**
 * Génère une chaîne aléatoire de la longueur spécifiée.
 * @param {number} length Longueur du mot de passe (8 par défaut).
 * @returns {string} Le mot de passe généré.
 */
const generateRandomPassword = (length = 8) => {
  // Définition de l'ensemble des caractères autorisés (sécurité minimale)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
  let password = '' // Initialisation de la chaîne de mot de passe avec let
  for (let i = 0; i < length; i++) {
    // Boucle foreach pour atteindre la longueur spécifiée
    // Ajoute un caractère aléatoire à la chaîne 'password'
    password += chars.charAt(Math.floor(Math.random() * chars.length))
    // password += ... : Opérateur d'addition et d'affectation de chaînes de caractères.
    // chars.charAt(...) : Utilise l'index entier généré aléatoirement (le résultat de Math.floor) pour extraire le caractère
    // Math.floor(...) : Arrondit le résultat à l'entier inférieur le plus proche.
    // Math.random() * chars.length : Multiplie le nombre aléatoire par la longueur totale des caractères.
    // Math.random() : Génère un nombre décimal pseudo-aléatoire entre 0 (inclus) et 1 (exclu).
    // chars.length : Récupère la longueur totale de la chaîne 'chars' (le nombre de caractères possibles).
  }
  return password // Retourne le mot de passe créé
}

// FONCTION DE SOUMISSION PRINCIPALE (Société -> Utilisateur -> E-mails)
const submitForm = async () => {
  // Fonction asynchrone pour gérer les appels API

  // DÉBUT DE LA VALIDATION SIRET PERSONNALISÉE
  if (companyData.value.n_siret.length !== 14) {
    // Vérifie si la longueur du SIRET n'est pas exactement 14
    error.value = 'Le numéro SIRET doit contenir exactement 14 chiffres.' // Affiche l'erreur
    return // Arrête l'exécution de la fonction si la validation échoue
  } // FIN DE LA VALIDATION SIRET

  loading.value = true // Active l'indicateur de chargement (le formulaire est en cours de soumission)
  error.value = null // Réinitialise tout message d'erreur précédent
  success.value = false // Réinitialise l'indicateur de succès

  // Variables pour stocker les données générées
  let autoEmail = '' // Email de connexion généré automatiquement pour les companys
  let autoPassword = '' // Mot de passe brut généré aléatoirement
  let newCompanyId = null // ID de la société créé par l'API (nécessaire pour lier l'utilisateur)

  try {
    // Bloc pour capturer et gérer toute erreur qui pourrait se produire durant les appels API
    // -------------------------------------------------------------------
    // ÉTAPE 1 : AJOUT DE LA SOCIÉTÉ (API: /api/addCompany)
    // -------------------------------------------------------------------
    console.log('Étape 1 : Envoi des données de la société...') // Log de l'étape

    // Crée un objet FormData pour l'envoi de données multi-parties (nécessaire pour les fichiers/uploads)
    const companyFormData = new FormData()
    // Remplissage des données de la société dans l'objet FormData
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
      // Vérifie si un fichier logo a été sélectionné
      companyFormData.append('logo', companyData.value.logo) // Ajoute le fichier au FormData
    } else {
      companyFormData.append('logo', '') // Envoie une chaîne vide si aucun logo n'est présent (selon l'attente de l'API)
    }

    // Envoi de la requête POST à l'API pour créer la société
    const companyResponse = await axios.post(
      // 'await' met la fonction en pause jusqu'à ce que la réponse arrive
      'http://127.0.0.1:8000/api/addCompany', // URL de l'API Laravel de mon back
      companyFormData, // Les données à envoyer (incluant le fichier logo si présent)
    )
    console.log('Société ajoutée (Réponse API) :', companyResponse.data) // Log la réponse du serveur

    // Récupération de l'ID pour la liaison avec l'utilisateur
    newCompanyId = companyResponse.data.data.id // Extrait l'ID de la société créée à partir de la réponse API

    if (!newCompanyId) {
      // Vérification critique : l'ID doit être présent pour continuer
      throw new Error("L'API n'a pas retourné l'ID de la société créée.") // Lance une erreur si l'ID est manquant
      // 'throw' : Mot-clé qui arrête immédiatement l'exécution normale du code.
      // new Error(...) : Crée un objet d'erreur standard JavaScript avec un message descriptif que je lui indique.
      // Le message personnalisé explique clairement la cause de l'arrêt (ID manquant).
      // Conséquence : L'exécution saute directement au bloc 'catch' de la fonction 'submitForm'
      // pour gérer l'échec et réinitialiser l'état (loading = false, affichage de l'erreur).
    }
    console.log(`ID de la société récupéré : ${newCompanyId}.`) // Log l'ID récupéré

    // -------------------------------------------------------------------
    // ÉTAPE 2 : AJOUT DE L'UTILISATEUR (API: /api/addUser)
    // -------------------------------------------------------------------

    console.log("Étape 2 : Envoi des données de l'utilisateur (avec Company ID)...")
    // Génération des identifiants (Email et Mot de passe brut)
    // Crée un 'slug' à partir du nom de la société (minuscule, espaces remplacés par tirets)

    const slugName = companyData.value.name.toLowerCase().replace(/\s/g, '-')
    autoEmail = `${slugName}@company.com` // Forme l'email de connexion généré (ex: 'ma-societe@company.com')
    autoPassword = generateRandomPassword(8) // Génère un mot de passe aléatoire de 8 caractères via la fonction ci-dessus

    // Crée un nouvel objet FormData pour les données utilisateur
    const userFormData = new FormData()
    // Remplissage des données utilisateur
    userFormData.append('nom', userData.value.nom)
    userFormData.append('prenom', userData.value.prenom)
    userFormData.append('telephone', userData.value.telephone)
    userFormData.append('ville', userData.value.ville)
    userFormData.append('code_postal', userData.value.code_postal)
    userFormData.append('company_id', newCompanyId) // **Liaison essentielle :** utilise l'ID obtenu à l'étape 1 qui nous recup l'id de la company créée

    // Champs automatiques (nécessaires pour la BDD et l'e-mail)
    userFormData.append('email', autoEmail) // Envoie l'email de connexion généré
    userFormData.append('password', autoPassword) // Envoie le mot de passe brut (l'API le hache)
    userFormData.append('disponibilite', 0) // la disponibilité par défaut à 0

    if (userData.value.photo) {
      // Vérifie si une photo a été sélectionnée
      userFormData.append('photo', userData.value.photo) // Ajoute le fichier au FormData
    }

    // Envoi de la requête POST à l'API pour créer l'utilisateur administrateur
    const userResponse = await axios.post('http://127.0.0.1:8000/api/addUser', userFormData)

    console.log('Utilisateur ajouté (Réponse API) :', userResponse.data) // Log la réponse du serveur

    // -------------------------------------------------------------------
    // ÉTAPE 3 : ENVOI DES IDENTIFIANTS PAR EMAIL (API: /api/send-identifiants-company)
    // -------------------------------------------------------------------

    // Prépare l'objet de données nécessaire à l'API d'envoi d'e-mail
    console.log("Étape 3 : Déclenchement de l'envoi des identifiants par e-mail...")

    const emailPayload = {
      company_name: companyData.value.name, // Nom de la société pour le corps de l'e-mail
      company_email: companyData.value.email_company, // **Adresse du destinataire**
      user_login_email: autoEmail, // identifiant email généré (pour le contenu de l'e-mail)
      user_raw_password: autoPassword, // identifiant Mot de passe généré (pour le contenu de l'e-mail)
      user_full_name: `${userData.value.prenom} ${userData.value.nom}`, // Nom complet
    }

    // Envoi de la requête POST à l'API pour déclencher l'envoi de l'e-mail
    const emailResponse = await axios.post(
      'http://127.0.0.1:8000/api/send-identifiants-company',
      emailPayload,
    )
    console.log('E-mails envoyés (Réponse API) :', emailResponse.data.message) // Log le message de succès de l'envoi

    // Finalisation du processus après les 3 étapes réussies
    success.value = true // Active l'indicateur de succès
    setTimeout(() => {
      // Démarre un délai
      // Redirection après succès (vers la page de connexion)
      router.push('/SignIn')
    }, 1000) // 1 seconde de délai
  } catch (err) {
    // Bloc exécuté si une erreur (réseau ou API) se produit dans le 'try'
    // GESTION DES ERREURS
    console.error('Erreur de soumission complète:', err) // Log l'erreur complète pour le développeur

    if (err.response) {
      // Vérifie si l'erreur provient d'une réponse HTTP du serveur (4xx ou 5xx)
      // Erreur serveur (4xx ou 5xx)
      const status = err.response.status // Récupère le code de statut HTTP (ex: 422, 500)
      const data = err.response.data // Récupère le corps de la réponse d'erreur

      if (status === 422 && data.errors) {
        // Cas spécifique : Erreur de validation de Laravel (champs manquants ou invalides)
        error.value = 'Erreur de validation. Veuillez vérifier tous les champs du formulaire.' // Log les erreurs détaillées de Laravel (utile pour le débogage)
        console.error('Erreurs de validation de Laravel:', data.errors)
      } else if (status === 500) {
        // Cas spécifique : Erreur interne du serveur
        error.value =
          data.error || // Utilise le champ 'error' ou 'message' si présent dans la réponse 500
          data.message || // Message d'erreur générique indiquant à quelle étape l'erreur 500 a probablement eu lieu
          `Erreur serveur inattendue (Code 500) à l'étape ${newCompanyId ? '2 ou 3' : '1'}.`
      } else {
        // Autres erreurs de statut HTTP (404, 401, etc.)
        error.value = data.message || `Erreur serveur (Code ${status}).`
      }
    } else if (err.message === "L'API n'a pas retourné l'ID de la société créée.") {
      // Erreur lancée manuellement si l'ID est manquant après l'étape 1
      error.value = "Échec critique à l'étape de création de la société."
    } else {
      // Erreur réseau ou timeout (aucune réponse serveur, par ex. serveur hors ligne)
      error.value = 'Erreur de connexion réseau. Veuillez vérifier votre accès à internet.'
    }
  } finally {
    // Bloc exécuté après 'try' ou 'catch', dans tous les cas
    loading.value = false // Désactive l'indicateur de chargement
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
          <label for="inputLogo">NOM (UTILISATEUR)</label>
          <input type="text" id="inputFirstName" v-model="userData.nom" required />
        </div>

        <div class="divAdd">
          <label for="inputLogo">PRENOM (UTILISATEUR)</label>
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
          ✅ Utilisateur et Société ajouté avec succès !
        </div>

        <button
          type="submit"
          class="btn"
          onclick="return confirm('Es-tu sûr de vouloir envoyer cette société à Admin ?')"
          title="Envoyer"
          :disabled="loading"
        >
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
