import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'

const apiEndpoint = `${process.env.VITE_STRAPI_URL}/api`

export const useCustomersStore = defineStore('customers', {
  state: () => ({
    customers: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetch() {
      this.loading = true
      try {
        const { data } = await axios.get(`${apiEndpoint}/users?filters[role][name][$eq]=Customer`)
        // Strapi puts objects inside data[]
        this.customers = data.map((item) => ({
          id: item.id,
          ...item, // flatten attributes
        }))
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
  }, // end eactions
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCustomersStore, import.meta.hot))
}
