<template>
  <q-page padding>
    <api-table title="Subscriptions" :rows="subscriptions" :columns="columns" :loading="loading" @request="fetch">
      <!-- Header -->
      <template v-slot:top-right="props">
        <div class="col">
          <div class="row q-col-gutter-md">
            <div class="col-auto">
              <q-btn round dense color="primary" icon="add" to="subscriptions/create" />
            </div>
            <div class="col-auto">
              <q-btn round outline dense color="primary" icon="refresh" @click="store.fetch()" />
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

      <template #cell-product="{ row }">
        <p v-if="row?.product" class="text-subtitle2">{{ row?.product.name }}</p>
        <q-badge v-else color="red">
          <q-icon name="warning" color="white" class="q-ml-xs" />
        </q-badge>
      </template>

      <template #cell-user="{ row }">
        {{ row.users_permissions_user.firstName }} {{ row.users_permissions_user.lastName }}
      </template>

        <template #cell-username="{ row }">
        {{ row.users_permissions_user.username }}
      </template>

      <template #cell-created_at="{ row }">
        {{ moment(row.createdAt).fromNow() }}
      </template>
    </api-table>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'SubscriptionsIndexPage'
})

import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubscriptionsStore } from 'src/stores/subscriptions'
import ApiTable from 'src/components/ApiTable.vue'
import moment from 'moment'


const store = useSubscriptionsStore()
const { subscriptions, loading } = storeToRefs(store)
const columns = [
  { name: 'ID', label: 'ID', field: 'id', align: "left", },
  { name: 'name', label: 'Name', field: 'name', align: "left" },
  { name: 'product', label: 'Product', field: 'product', align: "left" },
  { name: 'user', label: 'Fullname', field: 'users_permissions_user', align: "left" },
  { name: 'username', label: 'Username', field: 'users_permissions_user', align: "left" },
  { name: 'state', label: 'State', field: 'state', align: "left" },
  { name: 'created_at', label: 'Created At', field: 'createdAt', align: "right", }
]


onMounted(() => {
  store.fetch()
})

function fetch(pagination) {
  store.fetch(pagination)
}
</script>
