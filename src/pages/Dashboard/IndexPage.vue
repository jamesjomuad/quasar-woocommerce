<template>
  Dashboard
</template>

<script setup>
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
