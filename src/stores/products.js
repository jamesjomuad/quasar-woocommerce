import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'

const apiEndpoint = `${process.env.VITE_STRAPI_URL}/api`

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetch() {
      this.loading = true
      try {
        const { data } = await axios.get(`${apiEndpoint}/products?populate=*`)
        // Strapi puts objects inside data[]
        this.products = data.data.map((item) => ({
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
      await axios.post(`${apiEndpoint}/products`, { data: payload })
      await this.fetch()
    },
    async updateProduct(id, payload) {
      await axios.put(`${apiEndpoint}/products/${id}`, { data: payload })
      await this.fetch()
    },
    async deleteProduct(id) {
      await axios.delete(`${apiEndpoint}/products/${id}`)
      this.products = this.products.filter((p) => p.id !== id)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductsStore, import.meta.hot))
}
