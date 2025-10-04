<template>
  <q-page padding>
    <api-table title="Payments" :rows="subscriptions" :columns="columns" :loading="loading" @request="fetch">
      <!-- Header -->
      <template v-slot:top-right="props">
        <div class="col">
          <div class="row q-col-gutter-md">
            <div class="col-auto">
              <q-input
                  outlined
                  dense
                  debounce="600"
                  placeholder="Search"
                  @update:model-value="onSearch"
              >
                  <template v-slot:prepend>
                      <q-icon name="search" />
                  </template>
                  <!-- <template v-slot:append>
                      <q-icon name="close" @click="table.filter = ''" class="cursor-pointer" />
                  </template> -->
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn round dense color="primary" icon="add" to="payments/create" />
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

      <template #cell-subscription="{ row }">
        <b>{{ row.subscription.name }}</b>
      </template>

      <template #cell-name="{ row }">
        {{ row.users_permissions_user.firstName }} {{ row.users_permissions_user.lastName }}
      </template>

      <template #cell-email="{ row }">
        {{ row.users_permissions_user.email }}
      </template>

      <template #cell-created_at="{ row }">
        {{ moment(row.createdAt).fromNow() }}
      </template>
    </api-table>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePaymentsStore } from 'src/stores/payments'
import ApiTable from 'src/components/ApiTable.vue'
import moment from 'moment'


defineOptions({
  name: 'PaymentsIndexPage'
})

const store = usePaymentsStore()
const { subscriptions, loading } = storeToRefs(store)
const columns = [
  { name: 'ID', label: 'ID', field: 'id', align: "left", },
  { name: 'referenceCode', label: 'Reference Code', field: 'referenceCode', align: "left" },
  { name: 'subscription', label: 'Subscription', field: 'subscription', align: "left" },
  { name: 'name', label: 'Name', field: 'users_permissions_user', align: "left" },
  { name: 'email', label: 'Email', field: 'users_permissions_user', align: "left" },
  { name: 'created_at', label: 'Created At', field: 'createdAt', align: "right", }
]


onMounted(() => {
  store.fetch()
})

function fetch(pagination) {
  store.fetch(pagination)
}

function onSearch(){
  console.log('onSearch')
}
</script>
