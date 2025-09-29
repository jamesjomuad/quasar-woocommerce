<template>
  <q-item-label v-if="props.header" header>{{props.header}}</q-item-label>
  <q-item v-else clickable :to="props.link || undefined" @click="handleClick">
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-weight-medium">{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  header: { type: String, required: false },
  title: { type: String, required: false },
  caption: { type: String, default: '' },
  link: { type: [String, null], default: null },
  icon: { type: String, default: '' },
  onClick: { type: Function, default: null }
})

function handleClick(evt) {
  if (props.onClick) {
    evt.preventDefault() // prevent navigation if only function
    props.onClick()
  }
}
</script>
