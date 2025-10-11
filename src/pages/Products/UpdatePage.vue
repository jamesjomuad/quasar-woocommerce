<template>
  <q-page padding class="bg-surface">
    <q-card flat bordered class="card-update">
      <q-card-section>
        <div class="text-h6">Update Product</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form class="q-gutter-md">
          <div class="row q-col-gutter-md q-ma-sm">
            <!-- name -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="Name"
                outlined
                dense
                :rules="[val => !!val || 'Name is required']"
                name="name"
              />
            </div>

            <!-- sku -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.sku"
                label="SKU"
                outlined
                dense
                :rules="[val => !!val || 'SKU is required']"
                name="sku"
              />
            </div>

            <!-- description -->
            <div class="col-12">
              <q-input
                v-model="form.description"
                label="Description"
                type="textarea"
                outlined
                dense
                name="description"
              />
            </div>


            <!-- cost -->
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.cost"
                label="Cost"
                type="number"
                outlined
                dense
                :rules="[val => val > 0 || 'Enter valid price']"
                prefix="₱"
                name="cost"
              />
            </div>

            <!-- price -->
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.price"
                label="Price"
                type="number"
                outlined
                dense
                :rules="[val => val > 0 || 'Enter valid price']"
                prefix="₱"
                name="price"
              />
            </div>

            <!-- stock -->
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.stock"
                label="Stock"
                type="number"
                outlined
                dense
                :rules="[val => val >= 0 || 'Stock must be zero or more']"
                name="stock"
              />
            </div>

            <!-- taxable -->
            <div class="col-12 col-md-6">
              <q-toggle
                v-model="form.taxable"
                label="Taxable"
                color="primary"
              />
            </div>

            <!-- active -->
            <div class="col-12 col-md-6">
              <q-toggle
                v-model="form.active"
                label="Active"
                color="positive"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar, debounce } from 'quasar'
import { useRoute } from 'vue-router'
import { useProductsStore } from 'src/stores/products'


const $q = useQuasar()
const route = useRoute()
const store = useProductsStore()
const hasMounted = ref(false)
const form = ref({
  name: '',
  description: '',
  sku: '',
  price: '',
  stock: '',
  taxable: false,
  active: false,
  cost: '',
})



onMounted(async ()=>{
  $q.loading.show()
  let { data } = await store.get(route.params.id)

  form.value.name = data.name
  form.value.sku = data.sku
  form.value.description = data.description
  form.value.cost = data.cost
  form.value.price = data.price
  form.value.stock = data.stock
  form.value.taxable = data.taxable
  form.value.active = data.active

  $q.loading.hide()
  hasMounted.value = true
})

// Watch for changes
watch(
  form,
  () => {
    if (!hasMounted.value) return
    debounce(saveForm, 1000)()
  },
  { deep: true }
)

const saveForm = async () => {
  try {
    let { data } = await store.update(route.params.id, form.value)
    console.log('Auto saving...', data)
  } catch (err) {
    console.error('Save failed:', err)
  }
}
</script>
