<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from 'src/stores/appStore'
import TileLayout from './TileLayout.vue'
import AdminLayout from './AdminLayout.vue'

const appStore = useAppStore()
// const { layoutMode, darkMode, title } = storeToRefs(appStore)

const layoutComponent = computed(() =>
  appStore.layout === 'drawer' ? AdminLayout : TileLayout
)
</script>
