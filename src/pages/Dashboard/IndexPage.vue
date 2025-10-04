<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mb-md items-stretch">
      <div class="col-md-3">
        <q-card class="bg-primary text-white full-height" style=" min-height: 150px; ">
          <q-card-section>
            <div class="text-h5">Today</div>
            <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-secondary text-white full-height">
          <q-card-section>
            <div class="text-h5">Yesterday</div>
            <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
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

const auth = useAuthStore()

onMounted(() => {
  if (!auth.isAuthenticated) {
    // Redirect to login if not authenticated
    console.log(auth.user)
  }
})
</script>
