<template>
  <div>
    <!-- Trigger Slot -->
    <slot name="trigger" :open="openPicker">
      <q-btn
        :label="label"
        icon="perm_media"
        color="primary"
        outline
        @click="openPicker"
      />
    </slot>

    <!-- Selected Preview -->
    <div v-if="showPreview && selectedItems.length > 0" class="q-mt-sm">
      <div class="row q-gutter-sm">
        <div
          v-for="item in selectedItems"
          :key="item.id"
          class="selected-preview"
        >
          <q-img
            v-if="isImage(item)"
            :src="item.url"
            style="width: 80px; height: 80px"
            class="rounded-borders"
          >
            <q-btn
              round
              dense
              size="xs"
              icon="close"
              color="negative"
              class="absolute-top-right"
              style="margin: -8px"
              @click="removeItem(item)"
            />
          </q-img>
          <div v-else class="file-preview rounded-borders flex flex-center" style="width: 80px; height: 80px">
            <q-icon :name="getFileIcon(item)" size="32px" color="grey-6" />
            <q-btn
              round
              dense
              size="xs"
              icon="close"
              color="negative"
              class="absolute-top-right"
              style="margin: -8px"
              @click="removeItem(item)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Media Picker Dialog -->
    <q-dialog v-model="dialogOpen" maximized>
      <q-card>
        <q-bar class="bg-primary text-white">
          <q-icon name="perm_media" />
          <div class="text-weight-medium q-ml-sm">Select Media</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <q-card-section class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="col">
              <q-input
                v-model="searchQuery"
                dense
                outlined
                placeholder="Search media..."
                clearable
                @update:model-value="handleSearch"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-auto q-ml-md">
              <q-btn
                color="primary"
                icon="cloud_upload"
                label="Upload"
                @click="triggerUpload"
              />
              <input
                ref="fileInput"
                type="file"
                :multiple="multiple"
                :accept="acceptTypes"
                style="display: none"
                @change="handleFileSelect"
              />
            </div>
          </div>

          <!-- Filter tabs -->
          <q-tabs v-model="filterTab" class="q-mb-md" dense align="left" @update:model-value="handleFilterChange">
            <q-tab name="all" label="All" />
            <q-tab name="image" label="Images" />
            <q-tab name="video" label="Videos" />
            <q-tab name="document" label="Documents" />
          </q-tabs>

          <!-- Loading State -->
          <div v-if="loading" class="row justify-center q-pa-xl">
            <q-spinner-dots color="primary" size="40px" />
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredMedia.length === 0" class="text-center q-pa-xl">
            <q-icon name="perm_media" size="64px" color="grey-4" />
            <div class="text-h6 text-grey-6 q-mt-md">No media found</div>
          </div>

          <!-- Media Grid -->
          <div v-else class="row q-col-gutter-md" style="max-height: calc(100vh - 280px); overflow-y: auto;">
            <div
              v-for="item in filteredMedia"
              :key="item.id"
              class="col-6 col-sm-4 col-md-3 col-lg-2"
            >
              <q-card
                class="media-item cursor-pointer"
                :class="{ 'selected': isSelected(item) }"
                @click="toggleSelection(item)"
              >
                <q-img
                  v-if="isImage(item)"
                  :src="item.url"
                  :ratio="1"
                >
                  <template v-slot:loading>
                    <q-spinner-dots color="primary" />
                  </template>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3">
                      <q-icon name="broken_image" color="grey-6" size="32px" />
                    </div>
                  </template>
                </q-img>
                <div v-else class="media-placeholder flex flex-center">
                  <q-icon :name="getFileIcon(item)" size="48px" color="grey-6" />
                </div>

                <!-- Selection indicator -->
                <div v-if="isSelected(item)" class="selection-badge absolute-top-left q-ma-xs">
                  <q-icon name="check_circle" color="primary" size="24px" />
                </div>

                <q-card-section class="q-pa-xs">
                  <div class="text-caption ellipsis">{{ item.original_name || item.name }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="between" class="q-pa-md">
          <div class="text-body2 text-grey-7">
            {{ tempSelection.length }} item(s) selected
          </div>
          <div>
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn
              color="primary"
              label="Select"
              :disable="tempSelection.length === 0"
              @click="confirmSelection"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'MediaPicker'
})

const props = defineProps({
  modelValue: {
    type: [Array, Object],
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: 'image/*' // 'image/*', 'video/*', 'audio/*', '*/*'
  },
  label: {
    type: String,
    default: 'Select Media'
  },
  showPreview: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'selected'])

const $q = useQuasar()

// State
const dialogOpen = ref(false)
const loading = ref(false)
const media = ref([])
const tempSelection = ref([])
const searchQuery = ref('')
const filterTab = ref('all')
const fileInput = ref(null)

// Computed
const selectedItems = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return props.modelValue ? [props.modelValue] : []
})

const acceptTypes = computed(() => {
  switch (props.accept) {
    case 'image/*':
      return 'image/*'
    case 'video/*':
      return 'video/*'
    case 'audio/*':
      return 'audio/*'
    default:
      return 'image/*,video/*,audio/*,.pdf,.doc,.docx'
  }
})

const filteredMedia = computed(() => {
  let result = media.value

  // Filter by type
  if (filterTab.value !== 'all') {
    result = result.filter(item => item.type === filterTab.value)
  }

  // Filter by search (already handled server-side, but apply client-side filter as backup)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.original_name && item.original_name.toLowerCase().includes(query))
    )
  }

  return result
})

// Methods
function openPicker() {
  dialogOpen.value = true
  tempSelection.value = [...selectedItems.value]
  fetchMedia()
}

async function fetchMedia() {
  loading.value = true
  try {
    let result

    if (searchQuery.value) {
      result = await window.api.media.search(searchQuery.value)
    } else if (filterTab.value !== 'all') {
      result = await window.api.media.byType(filterTab.value)
    } else {
      result = await window.api.media.all()
    }

    if (result.error) {
      throw new Error(result.error)
    }

    media.value = result
  } catch (err) {
    console.error('Failed to fetch media:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load media'
    })
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  // Debounce search
  clearTimeout(window.mediaSearchTimeout)
  window.mediaSearchTimeout = setTimeout(() => {
    fetchMedia()
  }, 300)
}

function handleFilterChange() {
  fetchMedia()
}

function isSelected(item) {
  return tempSelection.value.some(s => s.id === item.id)
}

function toggleSelection(item) {
  const index = tempSelection.value.findIndex(s => s.id === item.id)

  if (props.multiple) {
    if (index === -1) {
      tempSelection.value.push(item)
    } else {
      tempSelection.value.splice(index, 1)
    }
  } else {
    // Single selection
    if (index === -1) {
      tempSelection.value = [item]
    } else {
      tempSelection.value = []
    }
  }
}

function confirmSelection() {
  const value = props.multiple ? tempSelection.value : tempSelection.value[0] || null
  emit('update:modelValue', value)
  emit('selected', value)
  dialogOpen.value = false
}

function removeItem(item) {
  if (props.multiple) {
    const newValue = selectedItems.value.filter(s => s.id !== item.id)
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', null)
  }
}

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileSelect(event) {
  const files = event.target.files
  if (files.length === 0) return

  loading.value = true

  try {
    for (const file of files) {
      // Read file as ArrayBuffer
      const buffer = await file.arrayBuffer()

      // Upload via API
      const result = await window.api.media.upload({
        buffer: Array.from(new Uint8Array(buffer)),
        name: file.name,
        mimeType: file.type,
        size: file.size
      })

      if (result.error) {
        throw new Error(result.error)
      }

      // Add to media list
      media.value.unshift(result)

      // Auto-select newly uploaded file
      if (props.multiple) {
        tempSelection.value.push(result)
      } else {
        tempSelection.value = [result]
      }
    }

    $q.notify({
      type: 'positive',
      message: `${files.length} file(s) uploaded`
    })
  } catch (err) {
    console.error('Upload failed:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to upload files: ' + err.message
    })
  } finally {
    loading.value = false
  }

  // Reset input
  event.target.value = ''
}

// Helpers
function isImage(item) {
  return item.type === 'image' || item.mime_type?.startsWith('image/')
}

function getFileIcon(item) {
  if (item.type === 'image' || item.mime_type?.startsWith('image/')) return 'image'
  if (item.type === 'video' || item.mime_type?.startsWith('video/')) return 'videocam'
  if (item.type === 'audio' || item.mime_type?.startsWith('audio/')) return 'audiotrack'
  if (item.mime_type?.includes('pdf')) return 'picture_as_pdf'
  return 'insert_drive_file'
}
</script>

<style scoped lang="scss">
.media-item {
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.selected {
    border-color: var(--q-primary);
  }
}

.media-placeholder {
  aspect-ratio: 1;
  background-color: #f5f5f5;
}

.selection-badge {
  background: white;
  border-radius: 50%;
}

.selected-preview {
  position: relative;
}

.file-preview {
  background-color: #f5f5f5;
  position: relative;
}
</style>
