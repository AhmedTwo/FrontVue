import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Connexion from '../views/SignIn.vue'
import Inscription from '../views/SignUp.vue'
import Password from '../views/PasswordForget.vue'
import ApplyCompany from '../views/AddCompany.vue'
import Apply from '../views/ApplyOffer.vue'
import Offers from '../views/Offers.vue'
import Companys from '../views/Companys.vue'
import CompanyDetails from '../views/CompanyDetails.vue'
import myRequest from '../views/MyRequest.vue'
import Request from '../views/Request.vue'
import DashboardCompany from '../views/DashboardCompany.vue'
import AddOffers from '../views/AddOffers.vue'
import DashboardAdmin from '../views/DashboardAdmin.vue'
import Favoris from '../views/Favoris.vue'
import Profil from '../views/Profil.vue'
import Contact from '../views/Contact.vue'
import UpdateMyRequest from '../views/UpdateMyRequest.vue'
import AddMyRequest from '../views/AddMyRequest.vue'
import UpdateOfferById from '../views/UpdateOffer.vue'
import UpdateCompanyByID from '../views/UpdateCompany.vue'
import UpdateProfil from '../views/UpdateProfil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: HomeView,
    },
    {
      path: '/SignIn',
      name: 'connexion',
      component: Connexion,
    },
    {
      path: '/SignUp/',
      name: 'inscription',
      component: Inscription,
    },
    {
      path: '/SignIn/passwordForget',
      name: 'motDePasse',
      component: Password,
    },
    {
      path: '/SignIn/AddCompany',
      name: 'ajoutSociete',
      component: ApplyCompany,
    },
    {
      path: '/offers/apply/:id',
      name: "Postuler à l'offre",
      component: Apply,
      props: (route) => ({
        // On crée une prop "offerId" qui sera envoyée au composant
        // On récupère l'ID depuis l'URL : route.params.id  (ex: "/apply/12" → "12")
        // On convertit la string "12" en nombre 12 avec Number() car le composant attend un Number
        offerId: Number(route.params.id),
      }),
    },
    {
      path: '/Offers',
      name: 'Nos Offres',
      component: Offers,
    },
    {
      path: '/Companys',
      name: 'Nos Companys',
      component: Companys,
    },
    {
      path: '/Companys/CompanyDetails/:id',
      name: 'Détails de la société',
      component: CompanyDetails,
    },
    {
      path: '/MyRequest', // id de users
      name: 'Mes Demandes',
      component: myRequest,
    },
    {
      path: '/Request',
      name: 'Toutes les Demandes',
      component: Request,
    },
    {
      path: '/Request',
      name: 'Toutes les Demandes',
      component: Request,
    },
    // Route Dashboard Principal
    {
      path: '/Dashboard_Company', // Gardez-la simple
      name: 'Tableau de Bord Société',
      component: DashboardCompany, // Ceci est maintenant la page unique du Dashboard
    },

    // Routes d'action (doivent être des pages complètes)
    {
      path: '/Dashboard_Company/AddOffers',
      name: "Ajout d'une offre",
      component: AddOffers,
    },
    {
      path: '/Dashboard_Company/UpdateOffer/:id',
      name: 'Modif Offre Company',
      component: UpdateOfferById,
    },
    {
      path: '/Dashboard_Company/UpdateCompany',
      name: 'Modif Company Dashboard',
      component: UpdateCompanyByID,
    },
    {
      path: '/Favoris',
      name: 'Mes Favoris',
      component: Favoris,
    },
    {
      path: '/Profil',
      name: 'Mon Profil',
      component: Profil,
    },
    {
      path: '/Contact',
      name: 'Contact',
      component: Contact,
    },
    {
      path: '/myRequest/UpdateMyRequest/:id',
      name: 'Modif Demande',
      component: UpdateMyRequest,
    },
    {
      path: '/Dashboard_Admin',
      name: 'Dashboard Admin',
      component: DashboardAdmin,
    },
    {
      path: '/Profil/UpdateProfil',
      name: 'Modif Profil',
      component: UpdateProfil,
    },
    {
      path: '/myRequest/AddMyRequest',
      name: 'Ajout Demande',
      component: AddMyRequest,
    },
  ],
})

export default router
