import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    login(userData) {
      this.isAuthenticated = true
      this.user = userData
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
      localStorage.removeItem('auth_token')
    },
  },
  persist: true, // cette ligne garde le store dans localStorage
})
