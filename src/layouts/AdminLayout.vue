<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ appStore.title }}
        </q-toolbar-title>

        <q-badge rounded color="white" class="text-red q-mr-md" :label="$q.screen.name" />

        <div class="q-mr-md">v{{ $q.version }}</div>
        <div>{{ $auth.user?.email }} ({{ $auth.user?.username }})</div>

        <q-toggle
          v-model="appStore.isDrawer"
          checked-icon="dashboard"
          unchecked-icon="grid_view"
          color="dark"
          @update:model-value="appStore.toggleLayout"
        />
      </q-toolbar>
    </q-header>

    <!-- Left drawer -->
    <q-drawer v-model="showLeftDrawer" show-if-above bordered :mini="leftDrawerOpen" :width="230" class="bg-light">
      <q-list>
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
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useTheme } from 'src/composables/theme'
import { useAppStore } from 'src/stores/appStore'
import MenuLink from 'src/components/MenuLink.vue'


const $q = useQuasar()
const $theme = useTheme()
const appStore = useAppStore()
const router = useRouter()
const $auth = useAuthStore()
const showLeftDrawer = ref(true)
const menus = [
  {
    header: "Home"
  },
  {
    title: 'Dashboard',
    icon: 'home',
    link: '/dashboard'
  },
  {
    header: "Transactions"
  },
  {
    title: 'Products',
    icon: 'add_business',
    link: '/products'
  },
  {
    title: 'Subscriptions',
    icon: 'shopping_cart',
    link: '/subscriptions'
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
    header: "Settings"
  },
  {
    title: 'Themes',
    caption: 'Customize look',
    icon: 'color_lens',
    link: '/themes'
  },
  {
    header: "Authentication"
  },
  {
    title: 'Account',
    icon: 'account_circle',
    link: '/account'
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
      $auth.logout()
      router.push('/login')
    }
  },
]

$theme.init()

if ($auth.isLogin()) {
  // remove login menu
  const index = menus.findIndex(m => m.title === 'Login')
  if (index !== -1) {
    menus.splice(index, 1)
  }
} else {
  // remove logout menu
  const index = menus.findIndex(m => m.title === 'Logout')
  if (index !== -1) {
    menus.splice(index, 1)
  }
}

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
  showLeftDrawer.value = true
}

</script>
