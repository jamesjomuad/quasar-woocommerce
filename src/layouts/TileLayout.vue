<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ appStore.title }}</q-toolbar-title>

        <q-badge rounded color="white" class="text-red q-mr-md" :label="$q.screen.name" />
        <div class="q-mr-md">v{{ $q.version }}</div>
        <div>{{ auth.user?.email }} ({{ auth.user?.username }})</div>

        <q-toggle
          v-model="appStore.isDrawer"
          checked-icon="dashboard"
          unchecked-icon="grid_view"
          color="dark"
          @update:model-value="appStore.toggleLayout"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- Show tile menu when on home -->
      <div v-if="showMenu" class="q-ma-md">
        <div key="menu" class="row q-col-gutter-md q-mb-md items-stretch">
          <div class="col" v-for="item in menus" :key="item.label">
            <q-card
              clickable
              bordered
              flat
              class="col-xs-12 col-sm-6 col-md-4 bg-dark text-white full-height text-center cursor-pointer"
              @click="goTo(item)"
            >
              <q-card-section class="text-center">
                <q-avatar
                  rounded
                  color="primary"
                  text-color="white"
                  :icon="item.icon"
                  size="80px"
                />
              </q-card-section>
              <q-card-section>
                <div class="text-h6">{{ item.label }}</div>
                <div v-if="item.caption" class="text-subtitle2">{{ item.caption }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <Breadcrumb v-if="!showMenu" key="page"/>

      <!-- Use router-view slot for transition -->
      <router-view v-slot="{ Component }">
        <transition-group name="fade" key="page">
          <component :is="Component" key="page"/>
        </transition-group>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAppStore } from 'src/stores/appStore'
import { useTheme } from 'src/composables/theme'
import { useAuthStore } from 'src/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from 'src/components/BreadCrumb.vue'


const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const $theme = useTheme()
const appStore = useAppStore()
const showMenu = ref(true)
const menus = [
  {
    label: 'Products',
    caption: 'Manage products & services',
    icon:'store',
    href:'/products'
  },
  {
    label: 'Customers',
    caption: 'Customer records',
    icon:'group',
    href:'/subscriptions'
  },
  {
    label: 'Subscriptions',
    caption: 'Manage customer subscriptions',
    icon:'rss_feed',
    href:'/subscriptions'
  },
  {
    label: 'Payments',
    caption: 'Payment records',
    icon:'payment',
    href:'/payments'
  },
  {
    label: 'Themes',
    caption: 'Manage system settings',
    icon:'color_lens',
    href:'/themes'
  },
  {
    label: 'Users',
    caption: 'Manage admin users',
    icon:'groups',
    href:''
  },
  {
    label: 'Logs',
    caption: 'System logs',
    icon:'assessment',
    href:''
  },
]

$theme.init()

function goTo(item) {
  console.log('Clicked:', item.label)
  if (item.href) router.push(item.href)
}


watch(
  () => route.name,
  (newVal) => {
    showMenu.value = newVal === 'Dashboard'
  },
  { immediate: true }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
