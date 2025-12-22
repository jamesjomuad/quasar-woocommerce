<template>
  <q-page padding class="bg-surface">
    <api-table title="Products" :rows="products" :columns="columns" :loading="loading" @request="fetch"
      @row-click="onRow">
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


      <!-- name -->
      <template #cell-name="{ row }">
        <p class="text-subtitle2">{{ row?.name }}</p>
      </template>

      <template #cell-price="{ row }">
        ₱{{ row.price }}
      </template>

      <template #cell-created_at="{ row }">
        {{ moment(row.created_at).fromNow() }}
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ApiTable from 'src/components/ApiTable.vue'
import UserFinder from 'src/components/UserFinder.vue'
import moment from 'moment'

defineOptions({
  name: 'ProductsIndexPage'
})

const router = useRouter()
const products = ref([])
const loading = ref(false)
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: "left" },
  { name: 'name', label: 'Name', field: 'name', align: "left" },
  { name: 'sku', label: 'SKU', field: 'sku', align: "left" },
  { name: 'price', label: 'Price', field: 'price', align: "left" },
  { name: 'stock', label: 'Stock', field: 'stock', align: "left" },
  { name: 'created_at', label: 'Created At', field: 'created_at', align: "right" },
  { name: 'actions', label: 'Action', align: "right" }
]

onMounted(() => {
  fetchProducts()
})

async function fetchProducts(pagination) {
  loading.value = true
  try {
    if (pagination) {
      const result = await window.api.product.paginate({
        page: pagination.page,
        perPage: pagination.rowsPerPage
      })
      if (result.error) {
        throw new Error(result.error)
      }
      products.value = result.data || result
    } else {
      const result = await window.api.product.all()
      if (result.error) {
        throw new Error(result.error)
      }
      products.value = result
    }
  } catch (err) {
    console.error('Failed to fetch products:', err)
  } finally {
    loading.value = false
  }
}

function fetch(pagination) {
  fetchProducts(pagination)
}

function onRefresh() {
  fetchProducts()
}

function onRow(e, v) {
  if (e.target.tagName.toLowerCase() == 'td')
    router.push(`/products/${v.id}`)
}

function onUserSelected(user) {
  console.log(user)
}
</script>
