import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'

const baseURL = 'https://orderly-purpose-cb5e4c55a4.strapiapp.com/api'

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
        const { data } = await axios.get(`${baseURL}/customers`)
        // Strapi puts objects inside data[]
        this.customers = data.data.map((item) => ({
          id: item.id,
          ...item, // flatten attributes
        }))
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async createProduct(payload) {
      await axios.post(`${baseURL}/customers`, { data: payload })
      await this.fetch()
    },
    async updateProduct(id, payload) {
      await axios.put(`${baseURL}/customers/${id}`, { data: payload })
      await this.fetch()
    },
    async deleteProduct(id) {
      await axios.delete(`${baseURL}/customers/${id}`)
      this.customers = this.customers.filter((p) => p.id !== id)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCustomersStore, import.meta.hot))
}
