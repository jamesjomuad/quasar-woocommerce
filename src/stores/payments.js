import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'

const apiEndpoint = `${process.env.VITE_STRAPI_URL}/api`

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    subscriptions: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetch() {
      this.loading = true
      try {
        const { data } = await axios.get(`${apiEndpoint}/payments?populate=*`)
        // Strapi puts objects inside data[]
        this.subscriptions = data.data.map((item) => ({
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
  import.meta.hot.accept(acceptHMRUpdate(usePaymentsStore, import.meta.hot))
}
