<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-md-3">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h5">Today</div>
            <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h5">Yesterday</div>
            <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-accent text-white">
          <q-card-section>
            <div class="text-h5">Payments</div>
            <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-dark text-white">
          <q-card-section>
            <div class="text-h5">Customers</div>
            <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-md-3">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="text-h5">Positive</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-negative text-white">
          <q-card-section>
            <div class="text-h5">Negative</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-info text-white">
          <q-card-section>
            <div class="text-h5">Info</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-warning text-white">
          <q-card-section>
            <div class="text-h5">Warning</div>
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
