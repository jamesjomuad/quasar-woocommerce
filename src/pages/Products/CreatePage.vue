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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import ToolBar from 'components/ToolBar.vue'

const $q = useQuasar()
const router = useRouter()
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

const saveForm = async () => {
  try {
    $q.loading.show({
      message: 'Creating product...',
    })

    const result = await window.api.product.create(form.value)

    if (result.error) {
      throw new Error(result.error)
    }

    $q.notify({
      type: 'positive',
      message: 'Product created successfully!',
      position: 'bottom-right',
    })

    console.log('Product created:', result)
    router.push('/products')
  } catch (err) {
    console.error('Save failed:', err)
    $q.notify({
      type: 'negative',
      message: err.message || 'Failed to create product',
      position: 'bottom-right',
    })
  } finally {
    $q.loading.hide()
  }
}
</script>
