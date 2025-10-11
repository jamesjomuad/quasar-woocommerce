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
    async get(id) {
      this.loading = true
      try {
        const { data } = await axios.get(`${apiEndpoint}/products/${id}?populate=*`)
        return data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async create(payload,$q) {
      try {
        $q.loading.show({
          message: 'Creating product...',
        })
        const { data } = await axios.post(`${apiEndpoint}/products`, { data: payload })
        $q.notify({
          type: 'positive',
          message: 'Product created successfully!',
          position: 'bottom-right',
        })
        return data
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        $q.loading.hide()
      }
    },
    async update(id, payload) {
      return await axios.put(`${apiEndpoint}/products/${id}`, { data: payload })
    },
    async delete(id) {
      await axios.delete(`${apiEndpoint}/products/${id}`)
      this.products = this.products.filter((p) => p.id !== id)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductsStore, import.meta.hot))
}
