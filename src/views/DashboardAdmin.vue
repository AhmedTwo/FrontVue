<script setup></script>

<template>
  <div class="header-section">
    <h1>MON TABLEAU DE BORD</h1>
    <p class="subtitle">Gérez vos utilisateurs, offres et sociétés en un seul endroit.</p>
  </div>

  <div class="dashboard-container">
    <!-- UTILISATEURS -->
    <div class="table-section">
      <div class="section-header bg-primary"><h2>LES UTILISATEURS</h2></div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOM</th>
              <th>PRÉNOM</th>
              <th>EMAIL</th>
              <th>RÔLE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>5</td>
              <td>Seghiri</td>
              <td>Ahmed</td>
              <td>seghiriahmed9@gmail.com</td>
              <td><span class="badge badge-admin">Admin</span></td>
              <td class="actions-cell">
                <a href="/Profil/UpdateProfil" title="Modifier">
                  <button class="btn-action btn-edit">
                    <!-- ✏️ Modifier -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16.862 4.487l2.651 2.651m-1.768-4.419a2.25 2.25 0 113.182 3.182L7.5 19.5H3v-4.5L17.745 2.719z"
                      />
                    </svg>
                  </button>
                </a>
                <button class="btn-action btn-delete" title="Supprimer">
                  <!-- 🗑️ Supprimer -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 7h12M9 7v10m6-10v10M4 7h16l-1 13H5L4 7zm5-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z"
                    />
                  </svg>
                </button>
              </td>
            </tr>

            <tr>
              <td>6</td>
              <td>Dupont</td>
              <td>Julie</td>
              <td>julie.dupont@email.com</td>
              <td><span class="badge badge-user">Utilisateur</span></td>
              <td class="actions-cell">
                <a href="/Profil/UpdateProfil" title="Modifier">
                  <button class="btn-action btn-edit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16.862 4.487l2.651 2.651m-1.768-4.419a2.25 2.25 0 113.182 3.182L7.5 19.5H3v-4.5L17.745 2.719z"
                      />
                    </svg>
                  </button>
                </a>
                <button class="btn-action btn-delete" title="Supprimer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 7h12M9 7v10m6-10v10M4 7h16l-1 13H5L4 7zm5-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- OFFRES -->
    <div class="table-section">
      <div class="section-header bg-secondary"><h2>LES OFFRES</h2></div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>TITRE</th>
              <th>ADRESSE</th>
              <th>DOMAINE</th>
              <th>DATE DE CRÉATION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Développeur Frontend</td>
              <td>Paris</td>
              <td>Informatique</td>
              <td>20-Oct-2025</td>
              <td class="actions-cell">
                <a href="/offers/UpdateOffer" title="Modifier">
                  <button class="btn-action btn-edit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16.862 4.487l2.651 2.651m-1.768-4.419a2.25 2.25 0 113.182 3.182L7.5 19.5H3v-4.5L17.745 2.719z"
                      />
                    </svg>
                  </button>
                </a>
                <a href="/offers/DeleteOffer" title="Supprimer">
                  <button class="btn-action btn-delete">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 7h12M9 7v10m6-10v10M4 7h16l-1 13H5L4 7zm5-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SOCIÉTÉS -->
    <div class="table-section">
      <div class="section-header bg-tertiary"><h2>LES SOCIÉTÉS</h2></div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOM</th>
              <th>ADRESSE</th>
              <th>DOMAINE</th>
              <th>N° SIRET</th>
              <th>STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>TechNova</td>
              <td>Paris</td>
              <td>Informatique</td>
              <td>123456789</td>
              <td><button class="btn-status btn-validated">Approuvée</button></td>
              <td class="actions-cell">
                <a href="/companys/CompanyDetails" title="Détails">
                  <button class="btn-action btn-info">
                    <!-- 👁️ Détails -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </a>
                <a href="/Dashboard_Admin/UpdateCompany" title="Modifier">
                  <button class="btn-action btn-edit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16.862 4.487l2.651 2.651m-1.768-4.419a2.25 2.25 0 113.182 3.182L7.5 19.5H3v-4.5L17.745 2.719z"
                      />
                    </svg>
                  </button>
                </a>
                <a href="/companys/DeleteCompany" title="Supprimer">
                  <button class="btn-action btn-delete">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 7h12M9 7v10m6-10v10M4 7h16l-1 13H5L4 7zm5-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* COULEURS THÉMATIQUES */
/* Primaire (Utilisateurs/Accent): #0d6efd */
/* Secondaire (Offres): #198754 (Vert) */
/* Tertiaire (Sociétés): #ffc107 (Jaune/Orange) */
/* Supprimer/Danger: #dc3545 (Rouge) */
/* Editer/Info: #0dcaf0 (Cyan) */
/* Fond de page: #f8f9fa */

/* -------------------
   EN-TÊTE
   ------------------- */
.header-section {
  text-align: center;
  margin-top: 30px; /* Marge réduite */
  margin-bottom: 30px;
}

h1 {
  font-size: 2rem; /* Légèrement réduit */
  font-weight: 800;
  color: #212529;
  letter-spacing: -0.5px;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
}

/* -------------------
   CONTENEUR PRINCIPAL
   ------------------- */
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px; /* Gap réduit entre les sections */
}

/* -------------------
   SECTION DE TABLEAU
   ------------------- */
.table-section {
  background: white;
  border-radius: 12px; /* Coins arrondis */
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.table-section:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* En-tête de section */
.section-header {
  padding: 15px 20px; /* Padding réduit */
  border-bottom: 1px solid #e9ecef;
}

.section-header h2 {
  margin: 0;
  font-size: 1.2rem; /* Taille réduite */
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.bg-primary {
  background-color: #0d6efd;
}
.bg-secondary {
  background-color: #198754;
}
.bg-tertiary {
  background-color: #ffc107;
}

/* Wrapper du tableau */
.table-wrapper {
  overflow-x: auto;
  padding: 15px; /* Padding réduit */
}

/* -------------------
   TABLEAU
   ------------------- */
table {
  width: 100%;
  border-collapse: separate; /* Permet un border-radius pour les coins */
  border-spacing: 0;
  min-width: 700px; /* S'assure que le tableau est scrollable horizontalement si nécessaire */
}

thead th {
  padding: 12px 15px; /* Padding réduit */
  text-align: left;
  font-weight: 700;
  font-size: 0.8rem; /* Très petit en-tête */
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

tbody td {
  padding: 12px 15px; /* Padding réduit */
  border-bottom: 1px solid #f0f0f0;
  color: #4a4a4a;
  font-size: 0.9rem;
}

tbody tr:hover {
  background: #e9f3fe; /* Bleu clair au survol */
  /* transform: scale(1.005); */ /* Retiré pour la compacité */
}

tbody tr:last-child td {
  border-bottom: none;
}

/* -------------------
   BADGES (RÔLES & STATUTS)
   ------------------- */
.badge {
  display: inline-block;
  padding: 4px 10px; /* Padding très réduit */
  border-radius: 15px;
  font-size: 0.75rem; /* Très petit */
  font-weight: 600;
  text-transform: uppercase;
}

.badge-admin {
  background-color: #0d6efd;
  color: white;
}
.badge-user {
  background-color: #e9ecef;
  color: #495057;
}
.badge-company {
  background-color: #ffc107;
  color: #343a40;
}

/* Boutons de statut (Sociétés) */
.btn-status {
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-validated {
  background-color: #198754;
  color: white;
}
.btn-pending {
  background-color: #ffc107;
  color: #212529;
}
.btn-rejected {
  background-color: #dc3545;
  color: white;
}

/* -------------------
   BOUTONS D'ACTION (EDITION / SUPPRESSION)
   ------------------- */
.actions-cell {
  display: flex;
  align-items: center;
  gap: 8px; /* Espacement réduit */
}

.btn-action {
  width: 30px; /* Taille fixe */
  height: 30px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
}

.btn-action svg {
  width: 14px;
  height: 14px;
}

/* Modifier (Bleu) */
.btn-edit {
  background-color: #0d6efd;
  color: white;
}
.btn-edit:hover {
  background-color: #0b5ed7;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
}

/* Supprimer (Rouge) */
.btn-delete {
  background-color: #dc3545;
  color: white;
}
.btn-delete:hover {
  background-color: #c9302c;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

/* Détails (Cyan) */
.btn-info {
  background-color: #0dcaf0;
  color: white;
}
.btn-info:hover {
  background-color: #0aabdb;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(13, 202, 240, 0.3);
}

/* -------------------
   RESPONSIVE (Gestion du défilement horizontal)
   ------------------- */

@media (max-width: 768px) {
  /* Le wrapper gère le scroll horizontal, mais le conteneur lui-même est optimisé */
  .dashboard-container {
    padding: 0 10px;
  }

  h1 {
    font-size: 1.8rem;
  }

  .table-section {
    border-radius: 8px;
  }
}
</style>
