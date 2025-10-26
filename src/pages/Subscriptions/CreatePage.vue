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
              <div class="col-12 col-md-12">
                <q-input
                  outlined
                  v-model="form.name"
                  readonly
                  label="Name"
                  name="name"
                  :rules="[val => !!val || 'Name is required']"
                />
              </div>
              <!-- product -->
              <div class="col-12 col-md-6">
                <q-input outlined v-model="product.name" label="Product" readonly>
                  <template v-slot:after>
                    <product-finder @selected="onProductSelected">
                      <template #button="{ open }">
                        <q-btn rounded label="Product" icon="add" color="primary" @click="open" />
                      </template>
                    </product-finder>
                  </template>
                </q-input>
              </div>
              <!-- user -->
              <div class="col-12 col-md-6">
                <q-input outlined v-model="customer.name" label="Customer" readonly>
                  <template v-slot:after>
                    <user-finder @selected="onUserSelected">
                      <template #button="{ open }">
                        <q-btn rounded label="Customer" icon="add" color="primary" @click="open" />
                      </template>
                    </user-finder>
                  </template>
                </q-input>
              </div>
            </div>
        </q-card-section>
        <q-card-section>
          <pre>{{ customer }}</pre>
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
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useSubscriptionStore } from 'src/stores/subscription'
import ToolBar from 'components/ToolBar.vue'
import UserFinder from 'src/components/UserFinder.vue'
import ProductFinder from 'src/components/ProductFinder.vue'


const $q = useQuasar()
const store = useSubscriptionStore()
const product = ref({
  name: ''
})
const customer = ref({
  name: ''
})
const form = ref({
  name: "",
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

// 🧠 Watch both product and user at once
watch(
  [() => product.value.name, () => customer.value.name],
  ([newProduct, newUser]) => {
    if (newProduct && newUser) {
      form.value.name = `${newProduct} - ${newUser}`
    } else if (newProduct) {
      form.value.name = newProduct
    } else if (newUser) {
      form.value.name = newUser
    } else {
      form.value.name = ""
    }
  }
)

const saveForm = async () => {
  try {
    let { data } = await store.create(form.value, $q)
    console.log('Saving...', data)
  } catch (err) {
    console.error('Save failed:', err)
  }
}

const onProductSelected = (v) => {
  product.value = v
  form.value.product = v.id
}

const onUserSelected = (v) => {
  customer.value = v
  customer.value.name = `${v.first_name} ${v.last_name} (${v.email})`
  form.value.user = v.id
}


defineOptions({
  name: 'SubscriptionsCreatePage'
})
</script>
