<template>
  <q-page padding>
    <api-table title="Products" :rows="products" :columns="columns" :loading="loading" @request="fetch">
      <template #cell-price="{ row }">
        ₱{{ row.price }}
      </template>

      <template #actions="{ row }">
        <q-btn flat icon="edit" color="primary" @click="edit(row)" />
        <q-btn flat icon="delete" color="negative" @click="remove(row.id)" />
      </template>
    </api-table>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'ProductsIndexPage'
})

import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from 'src/stores/products'
import ApiTable from 'src/components/ApiTable.vue'


const store = useProductsStore()
const { products, loading } = storeToRefs(store)
const columns = [
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'sku', label: 'SKU', field: 'sku' },
  { name: 'price', label: 'Price', field: 'price' },
  { name: 'stock', label: 'Stock', field: 'stock' },
  { name: 'actions', label: 'Actions', field: 'actions' }
]


onMounted(() => {
  store.fetch()
})

function fetch(pagination) {
  store.fetch(pagination)
}
</script>
