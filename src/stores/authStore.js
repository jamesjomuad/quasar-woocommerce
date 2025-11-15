import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import axios from 'axios'

const apiEndpoint = `${process.env.VITE_STRAPI_URL}/api`

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    initAuth() {
      const saved = LocalStorage.getItem('auth')
      if (saved?.jwt) {
        this.token = saved.jwt
        this.user = saved.user
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        // this.fetchUser() // optional: refresh user from Strapi
      }
    },

    async fetchUser() {
      if (this.token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          const res = await axios.get(`${apiEndpoint}/users/me`)
          this.user = res.data
        } catch (e) {
          console.error('Failed to fetch user:', e)
          this.logout()
        }
      }
    },

    async login({ username, password }) {
      const res = await axios.post(`${apiEndpoint}/auth/local`, {
        identifier: username,
        password,
      })
      this.user = res.data.user
      this.token = res.data.jwt
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      LocalStorage.set('auth', res.data)
    },

    logout() {
      this.user = null
      this.token = null
      LocalStorage.removeItem('auth')
      delete axios.defaults.headers.common['Authorization']
    },

    async register({ username, email, password }) {
      const res = await axios.post(`${apiEndpoint}/auth/local/register`, {
        username,
        email,
        password,
      })

      this.user = res.data.user
      this.token = res.data.jwt

      localStorage.setItem('token', this.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },

    isLogin() {
      return !!this.user
    },
  },
})
