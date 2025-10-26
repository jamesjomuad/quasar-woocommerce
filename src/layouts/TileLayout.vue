<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          {{ appStore.title }}
        </q-toolbar-title>

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
        <q-page padding>
          <h4 class="text-h4">Overview</h4>
          <div class="row q-col-gutter-md q-mb-md items-stretch">
            <div class="col-md-3">
              <q-card class="bg-info text-white full-height" style=" min-height: 150px; ">
                <q-card-section>
                  <div class="text-h5">Today</div>
                  <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
                </q-card-section>
                <q-card-section>
                  Welcome {{ auth.user.first_name }} {{ auth.user.last_name }}
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3">
              <q-card class="bg-primary text-white full-height">
                <q-card-section class="justify-between full-height column">
                  <div class="text-h5">Number of Products</div>
                  <div class="text-h2 text-center text-weight-medium">{{ productStore.products.length }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-2">
              <q-card class="bg-accent text-white full-height">
                <q-card-section>
                  <div class="text-h5">Payments</div>
                  <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-2">
              <q-card class="bg-dark text-white full-height">
                <q-card-section>
                  <div class="text-h5">Customers</div>
                  <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-2">
              <q-card class="bg-secondary text-dark full-height">
                <q-card-section>
                  <div class="text-h5">Dues</div>
                  <div class="text-subtitle2">{{ moment().format('MMMM Do YYYY') }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <h4 class="text-h4">Menus</h4>
          <div class="row q-col-gutter-md q-mb-md items-stretch">
            <div class="col-md-2 col-xl-3" v-for="item in menus" :key="item.label">
              <q-card bordered flat class="col-xs-12 col-sm-6 col-md-4 bg-grey-2 full-height">
                <q-card-section>
                  <div class="text-h6">{{ item.label }}</div>
                  <div v-if="item.caption" class="text-subtitle2">{{ item.caption }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAppStore } from 'src/stores/appStore'
import { useTheme } from 'src/composables/theme'
import { useAuthStore } from 'src/stores/auth'
import { useProductsStore } from 'src/stores/products'
import moment from 'moment'


const auth = useAuthStore()
const $theme = useTheme()
const appStore = useAppStore()
const productStore = useProductsStore()
const menus = [
  { label: 'Products', caption: 'Manage products & services' },
  { label: 'Customers', caption: 'Customer records' },
  { label: 'Subscriptions', caption: 'Manage customer subscriptions' },
  { label: 'Reports', caption: 'Visual data reports' },
  { label: 'Settings', caption: 'Manage system settings' },
  { label: 'Users', caption: 'Manage admin users' },
  { label: 'Logs', caption: 'System logs' },
]

$theme.init()
</script>
