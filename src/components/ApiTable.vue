<template>
  <q-card flat bordered class="q-pa-md">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>

    <q-card-section>
      <q-table :rows="rows" :columns="columns" row-key="id" :loading="loading" :pagination="pagination" flat bordered
        @request="onRequest">
        <!-- Custom cells -->
        <template v-for="col in columns" #[`body-cell-${col.name}`]="props" :key="col.name">
          <td>
            <slot :name="`cell-${col.name}`" v-bind="props">
              {{ props.row[col.field] }}
            </slot>
          </td>
        </template>

        <!-- Actions -->
        <template #body-cell-actions="props">
          <td>
            <slot name="actions" v-bind="props" />
          </td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: { type: String, default: 'Data' },
  rows: { type: Array, required: true },     // 👈 Provided by store
  columns: { type: Array, required: true },
  loading: { type: Boolean, default: false } // 👈 Store can provide this too
})

const pagination = ref({
  page: 1,
  rowsPerPage: 10
})

function onRequest(props) {
  // you can emit this to parent so store can re-fetch
  emit('request', props)
}

const emit = defineEmits(['request'])
</script>
