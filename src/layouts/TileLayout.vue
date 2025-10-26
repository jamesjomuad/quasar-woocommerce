<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ appStore.title }}</q-toolbar-title>
        <q-space />
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
      <q-page padding>
        <div class="row q-col-gutter-md">
          <q-card v-for="item in menus" :key="item.label" class="col-4">
            <q-card-section>{{ item.label }}</q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAppStore } from 'src/stores/appStore'
import { useTheme } from 'src/composables/theme'


const $theme = useTheme()
const appStore = useAppStore()

$theme.init()

const menus = [
  { label: 'Dashboard' },
  { label: 'Reports' },
  { label: 'Settings' },
]
</script>
