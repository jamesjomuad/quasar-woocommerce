<template>
  <q-page padding>
    <pre>{{ $options }}</pre>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'PaymentsIndexPage'
})

import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'


const auth = useAuthStore()


onMounted(() => {
  if (!auth.isAuthenticated) {
    // Redirect to login if not authenticated
    console.log(auth.user)
  }
})
</script>
