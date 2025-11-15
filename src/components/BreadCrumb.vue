<template>
  <q-breadcrumbs class="q-pa-sm bg-grey-1">
    <q-breadcrumbs-el label="Dashboard" to="/dashboard"/>
    <q-breadcrumbs-el
      v-for="(crumb, index) in breadcrumbs"
      :key="index"
      :label="crumb.label"
      :icon="crumb.icon"
      :to="crumb.to"
      :disable="index === breadcrumbs.length - 1"
      class="cursor-pointer text-primary"
    />
  </q-breadcrumbs>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(r => r.name) // Get route chain

  return matched.map((r, index) => ({
    label: r.meta?.breadcrumb || r.meta?.title || r.name,
    icon: r.meta?.icon || 'chevron_right',
    to: index < matched.length - 1 ? { name: r.name } : null
  }))
})
</script>
