<template>
  <!-- SLOT TRIGGER -->
  <slot name="button" :open="open">
    <!-- Default fallback button -->
    <q-btn label="Find User" color="primary" @click="open" />
  </slot>

  <!-- DIALOG -->
  <q-dialog full-width full-height v-model="showDialog" transition-show="scale">
    <q-card>
      <!-- Top Bar -->
      <q-card-section class="row items-center bg-primary">
          <div class="text-h6 text-white">Products</div>
          <q-space></q-space>
          <q-btn
              round
              dense
              outline
              v-close-popup
              color="white"
              icon="close"
          ></q-btn>
      </q-card-section>
      <q-card-section style="height: 70vh;" class="scroll">
        <q-table
            flat
            bordered
            binary-state-sort
            row-key="id"
            v-model:pagination="table.pagination"
            :rows="rows"
            :columns="table.columns"
            :loading="table.loading"
            :filter="table.filter"
            :rows-per-page-options="[5, 10, 20, 30, 40, 50, 80, 100, 150, 200]"
            style="height: 65vh"
            class="sticky-scroll-table"
            virtual-scroll
            @request="fetch"
            @row-click="table.onRow"
        >
          <!-- Thumbnail -->
          <template #body-cell-thumbnail="props">
            <q-td :props="props">
              <q-img :src="appUrl+props.row?.thumbnail?.formats?.medium?.url" style="width: 50px; height: 50px;" />
            </q-td>
          </template>

          <template #body-cell-created_at="props">
            <q-td :props="props">
                {{ moment(props.row.created_at).fromNow() }}
                <q-tooltip>
                    {{ moment(props.row.created_at).format("MMMM D, YYYY HH:mm:ss") }}
                </q-tooltip>
            </q-td>
        </template>
        </q-table>
    </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from "vue"
import { useQuasar } from "quasar"
import axios from 'axios'
import moment from 'moment'

const emit = defineEmits(["selected"]);

const appUrl = `${process.env.VITE_STRAPI_URL}`
const apiEndpoint = `${appUrl}/api`
const $q = useQuasar();
const showDialog = ref(false);
const search = ref("");
const users = ref([]);
const loading = ref(false);
const rows = ref([])
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: "left" },
  { name: 'thumbnail', label: 'Thumbnail', field: 'thumbnail', align: "left" },
  { name: 'name', label: 'Name', field: 'name', align: "left" },
  { name: 'sku', label: 'SKU', field: 'sku', align: "left" },
  { name: 'price', label: 'Price', field: 'price', align: "left" },
  { name: 'stock', label: 'Stock', field: 'stock', align: "left" },
  { name: 'created_at', label: 'Created At', field: 'createdAt', align: "right", },
  { name: 'actions', label: 'Action', align: "right", }
]
const table = reactive({
  loading: false,
  pagination: {
    page: 1,
    rowsPerPage: 10
  },
  columns,
  onRow(e, row){
    if( e.target.tagName.toLowerCase() !== 'td' ){ return }
    emit("selected", row)
    closeDialog();
  },
})


const open = () => {
  showDialog.value = true;
  fetch()
};

const closeDialog = () => {
  showDialog.value = false;
  search.value = "";
  users.value = [];
};

const fetch = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get(`${apiEndpoint}/products?populate=*`)
    rows.value = data.data.map((item) => ({
      id: item.id,
      ...item, // flatten attributes
    }))
  } catch (err) {
    console.log(err)
    $q.notify({ type: "negative", message: "Failed to fetch users" });
  } finally {
    loading.value = false;
  }
};

// Expose methods for manual control (optional)
defineExpose({ open, closeDialog });
</script>

<style lang="sass">
.sticky-scroll-table
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #ffffff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
