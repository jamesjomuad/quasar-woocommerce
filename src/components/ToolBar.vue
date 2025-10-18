<template>
  <q-page-sticky expand position="bottom" class="q-pa-none">
    <q-toolbar
      dense
      class="shadow-2"
      style="box-shadow: 0px 8px 20px;"
      :class="{ 'bg-white text-dark' : !$q.dark.isActive, 'bg-dark text-white' : $q.dark.isActive }"
    >
      <slot />
    </q-toolbar>
  </q-page-sticky>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>
