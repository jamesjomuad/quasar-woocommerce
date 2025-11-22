<template>
  <q-page padding>
    <api-table title="Customers" :rows="customers" :columns="columns" :loading="loading" @request="fetch">
      <template v-slot:top-right="props">
        <div class="col">
          <div class="row q-col-gutter-md">
            <div class="col-auto">
              <q-btn round dense color="primary" icon="add" to="bookings/create" />
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

      <template #cell-created_at="{ row }">
        {{ moment(row.createdAt).fromNow() }}
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
import { useCustomerStore } from 'src/stores/customerStore'
import ApiTable from 'src/components/ApiTable.vue'
import moment from 'moment'


const store = useCustomerStore()
const { customers, loading } = storeToRefs(store)
const columns = [
  { name: 'ID', label: 'ID', field: 'id', align: "left", },
  { name: 'first_name', label: 'First Name', field: 'first_name', align: "left", },
  { name: 'last_name', label: 'Last Name', field: 'last_name', align: "left", },
  { name: 'email', label: 'Email', field: 'email', align: "left", },
  { name: 'phone', label: 'Phone', field: 'phone', align: "left", },
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
  // Emit refresh event to ApiTable component
  // This is optional, depending on whether you want to notify the table of a manual refresh
  // You can remove this if not needed
  // emit('refresh')
}
</script>
