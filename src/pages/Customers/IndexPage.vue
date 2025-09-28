<template>
  <q-page padding>
    <api-table title="Customers" :rows="customers" :columns="columns" :loading="loading" @request="fetch">
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
import { useCustomersStore } from 'src/stores/customers'
import ApiTable from 'src/components/ApiTable.vue'


const store = useCustomersStore()
const { customers, loading } = storeToRefs(store)
const columns = [
  { name: 'first_name', label: 'First Name', field: 'first_name' },
  { name: 'last_name', label: 'Last Name', field: 'last_name' },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'phone', label: 'Phone', field: 'phone' },
  { name: 'total_spent', label: 'Total Spent', field: 'total_spent' }
]


onMounted(() => {
  store.fetch()
})

function fetch(pagination) {
  store.fetch(pagination)
}
</script>
