<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mb-md items-stretch">
      <div class="col-md-3">
        <q-card class="bg-info text-white full-height" style=" min-height: 150px; ">
          <q-card-section>
            <div class="text-h5">Today</div>
            <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
          </q-card-section>
          <q-card-section>
            Welcome {{ auth.user.first_name }} {{ auth.user.last_name }}
          </q-card-section>
        </q-card>
      </div>
      <!-- Products -->
      <div class="col-md-3">
        <q-card class="bg-primary text-white full-height">
          <q-card-section class="justify-between full-height column">
            <div class="text-h5">Number of Products</div>
            <div class="text-h2 text-center text-weight-medium">{{ productStore.products.length }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-accent text-white full-height">
          <q-card-section>
            <div class="text-h5">Payments</div>
            <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-dark text-white full-height">
          <q-card-section>
            <div class="text-h5">Customers</div>
            <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import moment from 'moment'
import { useProductsStore } from 'src/stores/products'

const auth = useAuthStore()
const productStore = useProductsStore()


onMounted(() => {
  if (!auth.isAuthenticated) {
    // Redirect to login if not authenticated
    console.log(auth.user)
  }
})

onMounted(()=>{
  productStore.fetch()
})
</script>
