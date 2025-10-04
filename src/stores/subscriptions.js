import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'

const apiEndpoint = `${process.env.VITE_STRAPI_URL}/api`

export const useSubscriptionsStore = defineStore('subscriptions', {
  state: () => ({
    keyword: '',
    subscriptions: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetch(prop){
      this.loading = true
      let url = `${apiEndpoint}/subscriptions?populate=*`


      if (prop?.keyword) {
        const keyword = encodeURIComponent(prop.keyword)

        url += `&filters[$or][0][name][$containsi]=${keyword}`
        url += `&filters[$or][1][state][$containsi]=${keyword}`
        url += `&filters[$or][2][product][name][$containsi]=${keyword}`
        url += `&filters[$or][3][users_permissions_user][username][$containsi]=${keyword}`
        url += `&filters[$or][4][users_permissions_user][email][$containsi]=${keyword}`
      }

      try {
        const { data } = await axios.get(url)
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
    async refresh(){
      this.keyword = ''
      this.fetch()
    }
  }, // end actions
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSubscriptionsStore, import.meta.hot))
}
