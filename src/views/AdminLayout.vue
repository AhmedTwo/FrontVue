<!-- fichier AdminLayout.vue -->
<!-- Ce composant sera le layout pour toutes les pages admin -->

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// État pour la sidebar mobile
const sidebarOpen = ref(false)

// Vérifier quelle page est active
const isActive = (path) => {
  return route.path === path || route.path.startsWith(path)
}

// Navigation items
const navItems = [
  {
    path: '/Dashboard_Admin',
    icon: '📊',
    label: 'Tableau de bord',
    description: "Vue d'ensemble",
  },
  {
    path: '/Dashboard_Admin/users',
    icon: '👥',
    label: 'Utilisateurs',
    description: 'Gérer les utilisateurs',
  },
  {
    path: '/Dashboard_Admin/offers',
    icon: '💼',
    label: 'Offres',
    description: 'Gérer les offres',
  },
  {
    path: '/Dashboard_Admin/companies',
    icon: '🏢',
    label: 'Sociétés',
    description: 'Gérer les sociétés',
  },
  {
    path: '/Request',
    icon: '📋',
    label: 'Demandes',
    description: 'Gérer les demandes',
  },
]

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <aside class="admin-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <h2>Administration</h2>
        <button class="close-sidebar" @click="toggleSidebar">✕</button>
      </div>

      <nav class="sidebar-nav">
        <a
          v-for="item in navItems"
          :key="item.path"
          :href="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <div class="nav-content">
            <span class="nav-label">{{ item.label }}</span>
            <span class="nav-description">{{ item.description }}</span>
          </div>
        </a>
      </nav>

      <div class="sidebar-footer">
        <p>© 2025 Portal Job Admin</p>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="admin-main">
      <!-- TOPBAR MOBILE -->
      <div class="admin-topbar">
        <button class="menu-toggle" @click="toggleSidebar">☰</button>
        <h1>Administration</h1>
      </div>

      <!-- CONTENU DE LA PAGE -->
      <div class="admin-content">
        <slot></slot>
      </div>
    </div>

    <!-- OVERLAY MOBILE -->
    <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="toggleSidebar"></div>
  </div>
</template>

<style scoped>
/* === LAYOUT PRINCIPAL === */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

/* === SIDEBAR === */
.admin-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-sidebar {
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

/* === NAVIGATION === */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  margin: 0.25rem 0;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border-left-color: #60a5fa;
}

.nav-item.active {
  background: rgba(96, 165, 250, 0.15);
  color: white;
  border-left-color: #60a5fa;
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 40%;
  background: #60a5fa;
  border-radius: 4px 0 0 4px;
}

.nav-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.nav-label {
  font-size: 0.95rem;
  font-weight: 500;
}

.nav-description {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* === FOOTER SIDEBAR === */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.8rem;
  color: #64748b;
}

/* === MAIN CONTENT === */
.admin-main {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.admin-topbar {
  display: none;
  background: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  align-items: center;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.menu-toggle {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #1e293b;
}

.admin-topbar h1 {
  font-size: 1.25rem;
  margin: 0;
  color: #1e293b;
}

.admin-content {
  flex: 1;
  padding: 2rem;
}

/* Overlay pour mobile */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar.sidebar-open {
    transform: translateX(0);
  }

  .admin-main {
    margin-left: 0;
  }

  .admin-topbar {
    display: flex;
  }

  .close-sidebar {
    display: block;
  }

  .sidebar-overlay.active {
    display: block;
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .admin-content {
    padding: 1rem;
  }

  .sidebar-header h2 {
    font-size: 1.25rem;
  }

  .nav-description {
    display: none;
  }
}

/* Scrollbar personnalisée pour la sidebar */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
