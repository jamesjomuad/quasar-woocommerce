<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-md-2">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h5">Primary</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h5">Secondary</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2">
        <q-card class="bg-accent text-white">
          <q-card-section>
            <div class="text-h5">Accent</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2">
        <q-card class="bg-light text-dark">
          <q-card-section>
            <div class="text-h5">Light</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2">
        <q-card class="bg-dark text-white">
          <q-card-section>
            <div class="text-h5">Dark</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2">
        <q-card class="bg-surface text-white">
          <q-card-section>
            <div class="text-h5">Surface</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-md-3">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="text-h5">Positive</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-negative text-white">
          <q-card-section>
            <div class="text-h5">Negative</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-info text-white">
          <q-card-section>
            <div class="text-h5">Info</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3">
        <q-card class="bg-warning text-white">
          <q-card-section>
            <div class="text-h5">Warning</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row theme-preview-container q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-4" v-for="(theme, key) in themes" :key="theme.name">
        <q-card flat class="cursor-pointer"
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
       position: 'bottom-right'
    })
    $q.notify({
       type: 'negative',
       message: '"Negative" type notification.',
       position: 'bottom-right'
    })
    $q.notify({
       type: 'warning',
       message: '"Warning" type notification.',
       position: 'bottom-right'
    })
    $q.notify({
       type: 'info',
       message: '"Info" type notification.',
       position: 'bottom-right'
    })
}
</script>
