<script setup>
import { computed, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ImagesLogo from './assets/images/logo_portal_job.png'

const userStore = useUserStore()
const router = useRouter()

const logout = () => {
  localStorage.removeItem('auth_token')
  userStore.logout()
  router.push('/') // redirection
}

onMounted(() => {
  if (localStorage.getItem('auth_token') !== null) {
    userStore.isAuthenticated = true
  }
})

// computed pour récupérer le prenom
const UserName = computed(() => {
  const prenom = userStore.user.prenom || ''
  // on prend la première lettre du prénom
  return (prenom || '').toUpperCase() // pour la majuscule
})

// Vérifier si l'utilisateur est une company
const isCompany = computed(() => userStore.user?.role === 'company')

// Vérifier si l'utilisateur est admin
const isAdmin = computed(() => userStore.user?.role === 'admin')
</script>

<template>
  <header id="headerOne">
    <nav id="navOne">
      <div class="nav-left">
        <a href="/" class="logo">
          <img :src="ImagesLogo" alt="fond logo portal job" />
        </a>
      </div>

      <ul class="menu" v-if="!userStore.isAuthenticated">
        <li><a href="/offers" class="">Nos offres</a></li>
        <li><a href="/Companys" class="">Nos sociétés</a></li>
        <li><a href="/Request" class="">Les demandes</a></li>
        <li><a href="/Contact" class="">Contact</a></li>
      </ul>

      <ul class="menu" v-if="userStore.isAuthenticated">
        <li><a href="/offers" class="">Nos offres</a></li>
        <li><a href="/Companys" class="">Nos sociétés</a></li>

        <li><a href="/MyRequest" class="">Mes demandes</a></li>
        <li><a href="/Request" class="" v-if="!isAdmin">Les demandes</a></li>

        <li>
          <a href="/Dashboard_Company" class="" v-if="isCompany">Dashboard</a>
        </li>

        <li class="dropdown" v-if="isAdmin">
          <a href="#">Administration ▾</a>
          <ul class="dropdown-content">
            <li><a href="/Dashboard_Admin" class="">Dashboard</a></li>
            <li><a href="/Request" class="">Les demandes</a></li>
          </ul>
        </li>
      </ul>

      <div class="nav-right" v-if="!userStore.isAuthenticated">
        <a href="/SignIn"> <button class="sign_in">CONNEXION</button> </a>
        <a href="/SignUp/"> <button class="sign_up">INSCRIPTION</button></a>
      </div>

      <div class="nav-right" v-if="userStore.isAuthenticated">
        <div class="user-info">
          <a href="/favoris" class="heart-link" title="Mes favoris" v-if="!isCompany">❤</a>

          <div class="user-dropdown">
            <input type="checkbox" id="user-toggle" hidden />
            <label for="user-toggle" class="user-name">{{ UserName }} ▾</label>

            <ul class="user-menu">
              <li><a href="/favoris" v-if="!isCompany">Favoris</a></li>
              <li><a href="/Profil">Profil</a></li>
              <li><a href="/Contact">Contact</a></li>
              <li><a @click="logout">Déconnexion</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <p>&copy; 2025 - Tous droits réservés</p>
  </footer>
</template>

<style scoped>
.sign_in,
.sign_up {
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sign_in {
  background-color: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}
.sign_in:hover {
  background-color: var(--primary);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.sign_up {
  background-color: var(--primary);
  color: white;
  border: 2px solid var(--primary);
}
.sign_up:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.logo img {
  width: 250px;
}

/* HEADER */
#headerOne {
  background-color: var(--bg);
  box-shadow: 0 6px 16px var(--shadow);
  border-bottom: 1px solid #ccc;
  position: relative;
  top: 0;
  z-index: 1000;
}

#navOne {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background-color: rgb(240, 240, 240);
}

/* LOGO */
.logo img {
  width: 200px;
}

/* MENU PRINCIPAL */
.menu {
  list-style: none;
  display: flex;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
}

/* afin que la liste s'affiche bien en dessous */
.menu > li {
  position: relative;
}

.menu a {
  text-decoration: none;
  color: var(--text);
  font-weight: 700;
  transition: color 0.3s;
}

.menu a:hover,
.menu a.active {
  color: var(--primary);
}

/* DROPDOWNS */
.dropdown-content {
  display: none;
  position: absolute;
  background: var(--bg);
  box-shadow: 0 4px 12px var(--shadow);
  border-radius: 6px;
  padding: 0.5rem 0;
  list-style: none;
}

.dropdown-content li a {
  display: block;
  padding: 0.5rem 1rem;
  color: black;
  list-style: none;
}

.dropdown-content a:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.dropdown:hover .dropdown-content {
  display: block;
}

/* === PARTIE DROITE === */
.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

/* Icône cœur */
.heart-link {
  text-decoration: none;
  color: red;
  font-size: 2rem;
  transition:
    transform 0.2s,
    color 0.2s;
}

.heart-link:hover {
  transform: scale(1.2);
  color: darkred;
}

/* === MENU UTILISATEUR === */
.user-dropdown {
  position: relative;
}

.user-name {
  cursor: pointer;
  font-weight: 700;
  color: var(--text);
}

/* Menu caché par défaut */
.user-menu {
  display: none;
  position: absolute;
  right: 0;
  top: 120%;
  background: var(--bg);
  box-shadow: 0 4px 12px var(--shadow);
  border-radius: 8px;
  list-style: none;
  padding: 0.5rem 0;
  min-width: 150px;
  z-index: 100;
}

/* Quand la case est cochée → afficher le menu */
#user-toggle:checked ~ .user-menu {
  display: block;
}

.user-menu li {
  text-align: left;
}

.user-menu a {
  display: block;
  padding: 0.6rem 1rem;
  color: var(--text);
  text-decoration: none;
  transition: background 0.2s;
}

.user-menu a:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

/* ========================================
   RESPONSIVE - MEDIA QUERIES
   ======================================== */

/* Tablettes (max 1024px) */
@media (max-width: 1024px) {
  #navOne {
    padding: 1rem 2rem;
  }

  .menu {
    gap: 1.5rem;
  }

  .logo img {
    width: 180px;
  }

  .nav-right {
    gap: 1rem;
  }
}

/* Tablettes portrait et petits écrans (max 768px) */
@media (max-width: 768px) {
  #navOne {
    flex-wrap: wrap;
    padding: 1rem;
    gap: 1rem;
  }

  .nav-left {
    flex: 1;
  }

  .logo img {
    width: 150px;
  }

  /* Menu principal passe en dessous */
  .menu {
    order: 3;
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
  }

  .menu > li {
    width: 100%;
    text-align: center;
  }

  .menu a {
    display: block;
    padding: 0.8rem;
  }

  /* Dropdowns en mobile */
  .dropdown-content {
    position: static;
    box-shadow: none;
    background: rgba(0, 123, 255, 0.05);
    margin-top: 0.5rem;
  }

  .nav-right {
    flex-direction: row;
    gap: 0.8rem;
  }

  .heart-link {
    font-size: 1.5rem;
  }
}

/* Mobile (max 480px) */
@media (max-width: 480px) {
  #navOne {
    padding: 0.8rem;
  }

  .logo img {
    width: 120px;
  }

  .menu {
    gap: 0.3rem;
    padding: 0.8rem 0;
  }

  .menu a {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .nav-right button {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .user-name {
    font-size: 0.9rem;
  }

  .heart-link {
    font-size: 1.3rem;
  }

  /* Menu utilisateur ajusté */
  .user-menu {
    min-width: 130px;
    right: -10px;
  }

  .user-menu a {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }

  /* Dropdown admin plus compact */
  .dropdown-content li a {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}

/* Très petits écrans (max 360px) */
@media (max-width: 360px) {
  .logo img {
    width: 100px;
  }

  .menu a {
    font-size: 0.85rem;
    padding: 0.5rem;
  }

  .nav-right {
    gap: 0.5rem;
  }

  .nav-right button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .user-name {
    font-size: 0.85rem;
  }
}
</style>
