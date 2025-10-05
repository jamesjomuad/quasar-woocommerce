<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Update Product</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md q-ma-sm">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="Name"
                outlined
                dense
                :rules="[val => !!val || 'Name is required']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.sku"
                label="SKU"
                outlined
                dense
                :rules="[val => !!val || 'SKU is required']"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.description"
                label="Description"
                type="textarea"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.price"
                label="Price"
                type="number"
                outlined
                dense
                :rules="[val => val > 0 || 'Enter valid price']"
                prefix="₱"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.stock"
                label="Stock"
                type="number"
                outlined
                dense
                :rules="[val => val >= 0 || 'Stock must be zero or more']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-toggle
                v-model="form.taxable"
                label="Taxable"
                color="primary"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-toggle
                v-model="form.active"
                label="Active"
                color="positive"
              />
            </div>
          </div>
          <div class="q-mt-md row">
            <q-space />
            <q-btn type="submit" label="Add" color="primary" />
            <!-- <q-btn flat label="Reset" color="grey" @click="resetForm" /> -->
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useProductsStore } from 'src/stores/products'


const $q = useQuasar()
const route = useRoute()
const store = useProductsStore()
const form = ref({
  name: '',
  description: '',
  sku: '',
  price: '',
  stock: '',
  taxable: false,
  active: true,
})

onMounted(async ()=>{
  let data = await store.get(route.params.id)
  console.log( data )
})

async function onSubmit() {
  try {
    const { data } = await store.create(form.value, $q)
    if( data?.id ){
      store.fetch()
    }
  } catch (error) {
    console.log(error)
  } finally {
    // always hide loading overlay
    $q.loading.hide()
  }
}
</script>
