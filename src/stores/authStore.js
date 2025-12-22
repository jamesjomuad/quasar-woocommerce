import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    initAuth() {
      const saved = LocalStorage.getItem('auth')
      if (saved?.user) {
        this.user = saved.user
      }
    },

    setUser(user) {
      this.user = user

      LocalStorage.set('auth', {
        token: this.token,
        user,
      })
    },

    logout() {
      this.user = null
      this.token = null

      LocalStorage.remove('auth')
      delete axios.defaults.headers.common.Authorization
    },
  },
})
