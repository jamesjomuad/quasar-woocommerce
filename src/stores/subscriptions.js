import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'

const apiEndpoint = process.env.API_BASE_URL

export const useSubscriptionsStore = defineStore('subscriptions', {
  state: () => ({
    subscriptions: [],
    loading: false,
    error: null,
  }),
  actions: {

    async fetch() {
      this.loading = true
      try {
        const { data } = await axios.get(`${apiEndpoint}/subscriptions?populate=*`)
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

  } // end eactions
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSubscriptionsStore, import.meta.hot))
}
