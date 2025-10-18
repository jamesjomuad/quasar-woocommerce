<template>
  <q-page padding class="bg-surface">
    <q-form @submit="saveForm">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">New Subscription</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
            <div class="row q-col-gutter-md q-ma-sm">
              <!-- name -->
              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="form.name"
                  label="Name"
                  name="name"
                  :rules="[val => !!val || 'Name is required']"
                />
              </div>
              <!-- product -->
              <div class="col-12 col-md-6">
                <q-input outlined dense v-model="form.product" class="q-ml-md" readonly>
                  <template v-slot:after>
                    <product-finder @selected="onProductSelected">
                      <template #button="{ open }">
                        <q-btn rounded label="Product" icon="add" color="primary" @click="open" />
                      </template>
                    </product-finder>
                  </template>
                </q-input>
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
import { useSubscriptionStore } from 'src/stores/subscription'
import ToolBar from 'components/ToolBar.vue'
import ProductFinder from 'src/components/ProductFinder.vue'


const $q = useQuasar()
const store = useSubscriptionStore()
const form = ref({
  name: "Premium Fiber Plan",
  product: null,
  start_date: "2025-10-17T00:00:00.000Z",
  end_date: "2026-10-17T00:00:00.000Z",
  state: "active",
  billing_day: 17,
  users_permissions_user: 5,
  payments: [1, 2]
})


onMounted(async ()=>{
  $q.loading.show()
  console.log(store)

  $q.loading.hide()
})

const saveForm = async () => {
  try {
    let { data } = await store.create(form.value, $q)
    console.log('Saving...', data)
  } catch (err) {
    console.error('Save failed:', err)
  }
}

const onProductSelected = (product) => {
  console.log(product)
}


defineOptions({
  name: 'SubscriptionsCreatePage'
})
</script>
