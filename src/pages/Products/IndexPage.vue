<template>
  <q-page padding class="bg-surface">
    <api-table
      title="Products"
      :rows="products"
      :columns="columns"
      :loading="loading"
      @request="fetch"
      @row-click="onRow"
    >
      <!-- Header -->
      <template v-slot:top-right="props">
        <div class="col">
          <div class="row q-col-gutter-md">
            <div class="col-auto">
              <q-btn round dense color="primary" icon="add" to="products/create" />
            </div>
            <div class="col-auto">
              <q-btn round outline dense color="primary" icon="refresh" @click="onRefresh" />
            </div>
            <div class="col-auto">
              <!-- Toggle fullscreen -->
              <q-btn outline round size="sm" color="grey-8"
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen">
                <q-tooltip>Toggle Fullscreen</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </template>

      <!-- Thumbnail -->
      <template #cell-thumbnail="{ row }">
        <q-img :src="appUrl+row.thumbnail?.formats?.medium?.url" style="width: 50px; height: 50px;" />
      </template>

      <!-- name -->
      <template #cell-name="{ row }">
        <p class="text-subtitle2">{{ row?.name }}</p>
      </template>

      <template #cell-price="{ row }">
        ₱{{ row.price }}
      </template>

      <template #cell-created_at="{ row }">
        {{ moment(row.createdAt).fromNow() }}
      </template>

      <template #cell-actions>
        <user-finder @selected="onUserSelected">
          <template #button="{ open }">
            <q-btn rounded label="Subscribe" icon="cast" color="primary" @click="open" />
          </template>
        </user-finder>
      </template>
    </api-table>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useProductsStore } from 'src/stores/products'
import ApiTable from 'src/components/ApiTable.vue'
import UserFinder from 'src/components/UserFinder.vue'
import moment from 'moment'

defineOptions({
  name: 'ProductsIndexPage'
})

const appUrl = `${process.env.VITE_STRAPI_URL}`
const router = useRouter()
const store = useProductsStore()
const { products, loading } = storeToRefs(store)
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: "left" },
  { name: 'thumbnail', label: 'Thumbnail', field: 'thumbnail', align: "left" },
  { name: 'name', label: 'Name', field: 'name', align: "left" },
  { name: 'sku', label: 'SKU', field: 'sku', align: "left" },
  { name: 'price', label: 'Price', field: 'price', align: "left" },
  { name: 'stock', label: 'Stock', field: 'stock', align: "left" },
  { name: 'created_at', label: 'Created At', field: 'createdAt', align: "right", },
  { name: 'actions', label: 'Action', align: "right", }
]


onMounted(() => {
  store.fetch()
})

function fetch(pagination) {
  store.fetch(pagination)
}

function onRefresh() {
  store.fetch()
}

function onRow(e,v){
  if( e.target.tagName.toLowerCase() == 'td' )
  router.push(`/products/${v.documentId}`)
}

function onUserSelected(user){
  console.log(user)
}
</script>
