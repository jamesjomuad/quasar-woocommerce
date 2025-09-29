<template>
  <q-page padding>
    <div class="row q-pa-sm theme-preview-container q-gutter-xs">
      <q-card flat v-for="(theme, key) in themes" :key="theme.name" class="cursor-pointer col-12"
          @click="set(key);"
          :style="{
              color: theme.colors.dark,
              border: '1px solid '+theme.colors['primary']
          }"
      >
          <q-card-section class="q-pa-sm row justify-between">
              <div class="text-h6" :class="{'text-white':$q.dark.isActive}" style="font-size:15px;">
                  {{ theme.name }}
              </div>
              <div class="theme-colors">
                  <q-toggle
                      v-model="theme.active"
                      checked-icon="check"
                      color="green"
                      unchecked-icon="clear"
                      disable
                  />
                  <q-badge v-for="color in ['primary', 'secondary', 'accent', 'positive', 'negative', 'info', 'warning']" :key="color" :style="{ backgroundColor: theme.colors[color] }" class="q-mr-xs" />
              </div>
          </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>


<script setup>
import { useTheme } from 'src/composables/theme'
import { useQuasar } from 'quasar'


const { themes, setTheme } = useTheme()
const $q = useQuasar();

const set = (name) => {
    setTheme( name )
    $q.notify({
       type: 'positive',
       message: '"Positive" type notification.',
       position: 'bottom'
    })
    $q.notify({
       type: 'negative',
       message: '"Negative" type notification.',
       position: 'bottom'
    })
    $q.notify({
       type: 'warning',
       message: '"Warning" type notification.',
       position: 'bottom'
    })
    $q.notify({
       type: 'info',
       message: '"Info" type notification.',
       position: 'bottom'
    })
}
</script>
