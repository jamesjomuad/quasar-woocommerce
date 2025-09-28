<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <!-- Left drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <!-- <q-item-label header> Essential Links</q-item-label> -->
        <MenuLink v-for="link in menus" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import MenuLink from 'src/components/MenuLink.vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const auth = useAuthStore()
const menus = [
  {
    title: 'Dashboard',
    caption: 'Home',
    icon: 'home',
    link: '/dashboard'
  },
  {
    title: 'Products',
    icon: 'add_business',
    link: '/products'
  },
  {
    title: 'Payments',
    icon: 'credit_card',
    link: '/payments'
  },
  {
    title: 'Customers',
    icon: 'groups',
    link: '/customers'
  },
  {
    title: 'Themes',
    caption: 'Customize look',
    icon: 'color_lens',
    link: '/themes'
  },
  {
    title: 'Login',
    caption: 'Authentication',
    icon: 'login',
    link: '/login'
  },
  {
    title: 'Logout',
    caption: 'Exit',
    icon: 'logout',
    onClick: () => {
      auth.logout()
      router.push('/login')
    }
  },
]

if (auth.isLogin()) {
  menus.splice(5, 1) // remove login menu
} else {
  menus.splice(6, 1) // remove logout menu
}


const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
