<template>
  <q-page class="flex flex-center bg-gray-100">
    <q-card class="w-96 p-6 rounded-2xl shadow-lg" style="width: 550px;">
      <q-card-section>
        <div class="text-h6 text-center">Create account</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onRegister">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input filled v-model="form.username" label="Username" required :rules="[val => !!val || 'Username is required']" />
            </div>
            <div class="col-6">
              <q-input filled v-model="form.first_name" label="First name" required :rules="[val => !!val || 'First name is required']" />
            </div>
            <div class="col-6">
              <q-input filled v-model="form.last_name" label="Last name" required :rules="[val => !!val || 'Last name is required']" />
            </div>
            <div class="col-12">
              <q-input filled v-model="form.email" label="Email" type="email" required :rules="[val => !!val || 'Email is required']" />
            </div>
            <div class="col-12">
              <q-input filled v-model="form.phone" label="Phone" type="phone" required/>
            </div>
            <div class="col-12">
              <q-input filled v-model="form.password" label="Password" type="password" required :rules="[val => !!val || 'Password is required']" />
            </div>
            <div class="col-12">
              <q-input filled v-model="form.password_confirmation" label="Confirm Password" type="password" required :rules="[ val => !!val || 'Confirm password required', val => val === form.password || 'Passwords do not match' ]" />
            </div>
          </div>

          <q-banner v-if="errorMessage" class="bg-red-5 text-white q-mb-md">
            {{ errorMessage }}
          </q-banner>

          <div class="q-mt-md">
            <q-btn type="submit" label="Create" color="primary" class="full-width" :loading="loading" />
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

const router = useRouter()
const $user = window.api.user;
const form = ref({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const onRegister = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    let data = await $user.create({
      username: form.value.username,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
    });
    console.log(data)
    if(data?.error){
      errorMessage.value = data.error
    }
    // router.push('/') // redirect after successful register
  } catch (err) {
    errorMessage.value = 'Registration failed. Try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
