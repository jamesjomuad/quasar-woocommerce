<template>
  <q-page class="flex flex-center bg-dark">
    <transition
      appear
      enter-active-class="animated zoomIn delay-2s"
      leave-active-class="animated zoomOut"
    >
      <q-card class="w-96 p-6 rounded-2xl shadow-lg q-pa-md" style="width: 450px;" :class="{ 'animated shakeX': error }" @animationend="error = false">
        <q-card-section>
          <div class="text-h5 text-center text-weight-bold">Login</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="onLogin" class="q-gutter-md">
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
    </transition>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { useRouter } from 'vue-router'

const $auth = window.api.auth;
const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
// eslint-disable-next-line no-unused-vars
const auth = useAuthStore()
const router = useRouter()
const error = ref(false)

onMounted(async () => {
  let data = await window.api.user.all();
  if(data.length==0){
    router.push('/register')
  }
})

const onLogin = async () => {
  loading.value = true
  try {
    let user = await $auth.login({
      username: form.value.username,
      password: form.value.password,
    })
    console.log(user)
    if(user.success==false){
      error.value = true
    }
    // await auth.login(form.value)
    // router.push('/')
  } catch (error) {
    console.log('Login error:', error.message)
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
