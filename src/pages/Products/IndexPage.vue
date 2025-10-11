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
      <template #cell-image="{ row }">
        <q-img :src="row.image?.formats?.small?.url" style="width: 50px; height: 50px;" />
      </template>

      <template #cell-price="{ row }">
        ₱{{ row.price }}
      </template>

      <template #cell-created_at="{ row }">
        {{ moment(row.createdAt).fromNow() }}
      </template>

      <template #actions="{ row }">
        <q-btn flat icon="edit" color="primary" @click="edit(row)" />
        <q-btn flat icon="delete" color="negative" @click="remove(row.id)" />
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
import moment from 'moment'

defineOptions({
  name: 'ProductsIndexPage'
})

const router = useRouter()
const store = useProductsStore()
const { products, loading } = storeToRefs(store)
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: "left" },
  { name: 'image', label: 'Thumbnail', field: 'image', align: "left" },
  { name: 'name', label: 'Name', field: 'name', align: "left" },
  { name: 'sku', label: 'SKU', field: 'sku', align: "left" },
  { name: 'price', label: 'Price', field: 'price', align: "left" },
  { name: 'stock', label: 'Stock', field: 'stock', align: "left" },
  { name: 'created_at', label: 'Created At', field: 'createdAt', align: "right", }
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
  console.log('onRow', v)
  router.push(`/products/${v.documentId}`)
}
</script>
