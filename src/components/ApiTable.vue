<template>
  <q-table v-bind="$attrs" v-on="$attrs" :title="title" :rows="rows" :columns="columns" row-key="id" :loading="loading" :pagination="pagination" flat
    bordered>
    <template v-slot:top-right="props">
      <slot name="top-right" v-bind="props" />
    </template>

    <!-- Custom cells -->
    <template v-for="col in columns" #[`body-cell-${col.name}`]="props" :key="col.name">
      <q-td :props="props">
        <slot :name="`cell-${col.name}`" v-bind="props">
          {{ props.row[col.field] }}
        </slot>
      </q-td>
    </template>

    <!-- Actions -->
    <template #body-cell-actions="props">
      <q-td>
        <slot name="actions" v-bind="props" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ inheritAttrs: false })

defineProps({
  title: { type: String, default: 'Data' },
  rows: { type: Array, required: true },
  columns: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})

const pagination = ref({
  page: 1,
  rowsPerPage: 10
})
</script>

<style scoped>
.q-table__card{ background-color: rgb(255 255 255 / 40%); }
</style>
