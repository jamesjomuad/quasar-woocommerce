<template>
  <q-page class="flex flex-center bg-gray-100">
    <q-card class="w-96 p-6 rounded-2xl shadow-lg" style="width: 450px;">
      <q-card-section>
        <div class="text-xl font-bold text-center">Register</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleRegister" class="q-gutter-md">
          <q-input filled v-model="form.username" label="Username" required
            :rules="[val => !!val || 'Username is required']" />
          <q-input filled v-model="form.email" label="Email" type="email" required
            :rules="[val => !!val || 'Email is required']" />
          <q-input filled v-model="form.password" label="Password" type="password" required
            :rules="[val => !!val || 'Password is required']" />

          <q-banner v-if="errorMessage" class="bg-red-5 text-white q-mb-md">
            {{ errorMessage }}
          </q-banner>

          <div class="q-mt-md">
            <q-btn type="submit" label="Register" color="primary" class="full-width" :loading="loading" />
          </div>

          <q-separator />

          <div class="text-center q-mt-sm">
            <q-btn flat label="Already have an account? Login" color="primary" @click="router.push('/login')" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    await auth.register(form.value)
    router.push('/') // redirect after successful register
  } catch (err) {
    errorMessage.value = 'Registration failed. Try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
