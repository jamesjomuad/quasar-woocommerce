<template>
  <q-page class="flex flex-center bg-gray-100">
    <q-card class="w-96 p-6 rounded-2xl shadow-lg" style="width: 450px;">
      <q-card-section>
        <div class="text-xl font-bold text-center">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input filled v-model="form.username" label="Username" type="text" required
            :rules="[val => !!val || 'Username is required']" />
          <q-input filled v-model="form.password" label="Password" type="password" required
            :rules="[val => !!val || 'Password is required']" />

          <div class="q-mt-md">
            <q-btn size="lg" type="submit" label="Login" color="primary" class="full-width" :loading="loading" />
          </div>
          <q-separator />
          <div class="text-center q-mt-sm">
            <q-btn flat label="Register" color="primary" @click="router.push('/register')" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  try {
    await auth.login(form.value)
    router.push('/dashboard')
  } catch (err) {
    console.error('Login failed:', err)
  } finally {
    loading.value = false
  }
}
</script>
