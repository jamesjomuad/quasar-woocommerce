<template>
  <q-page padding class="bg-surface">
    <q-form @submit="saveForm">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">New Product</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
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
        </q-card-section>
      </q-card>

      <!-- Action Buttons -->
      <tool-bar>
        <q-space />
        <div class="col-auto">
          <q-btn label="Create" type="submit" color="primary" class="q-ml-auto"/>
        </div>
      </tool-bar>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useProductsStore } from 'src/stores/products'
import ToolBar from 'components/ToolBar.vue'



const $q = useQuasar()
const store = useProductsStore()
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


  $q.loading.hide()
})


const saveForm = async () => {
  try {
    let { data } = await store.create(form.value, $q)
    console.log('Auto saving...', data)
  } catch (err) {
    console.error('Save failed:', err)
  }
}
</script>
