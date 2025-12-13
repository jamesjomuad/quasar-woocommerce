<template>
  <q-page padding class="bg-surface">
    <div class="q-mb-md">
      <div class="row items-center justify-between">
        <div class="text-h5 text-weight-bold">Media Library</div>
        <div class="row q-gutter-sm">
          <q-btn
            round
            dense
            color="primary"
            icon="cloud_upload"
            @click="triggerUpload"
          >
            <q-tooltip>Upload Media</q-tooltip>
          </q-btn>
          <q-btn
            round
            outline
            dense
            color="primary"
            icon="refresh"
            @click="fetchMedia"
          >
            <q-tooltip>Refresh</q-tooltip>
          </q-btn>
          <q-btn-toggle
            v-model="viewMode"
            toggle-color="primary"
            :options="[
              { icon: 'grid_view', value: 'grid' },
              { icon: 'view_list', value: 'list' }
            ]"
            dense
            unelevated
          />
        </div>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      style="display: none"
      @change="handleFileSelect"
    />

    <!-- Upload progress -->
    <q-linear-progress
      v-if="uploading"
      :value="uploadProgress"
      color="primary"
      class="q-mb-md"
    />

    <!-- Drag & Drop Zone -->
    <div
      class="upload-zone q-pa-xl q-mb-lg text-center"
      :class="{ 'drag-over': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerUpload"
    >
      <q-icon name="cloud_upload" size="48px" color="grey-6" />
      <div class="text-subtitle1 text-grey-7 q-mt-sm">
        Drag & drop files here or click to upload
      </div>
      <div class="text-caption text-grey-5">
        Supports: Images, Videos, Audio, PDF, Documents
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Empty State -->
    <div v-else-if="media.length === 0" class="text-center q-pa-xl">
      <q-icon name="perm_media" size="64px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">No media files yet</div>
      <div class="text-body2 text-grey-5">Upload your first media file to get started</div>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="row q-col-gutter-md">
      <div
        v-for="item in media"
        :key="item.id"
        class="col-6 col-sm-4 col-md-3 col-lg-2"
      >
        <q-card
          class="media-card cursor-pointer"
          :class="{ 'selected': selectedMedia.includes(item.id) }"
          @click="toggleSelect(item)"
        >
          <q-img
            v-if="isImage(item)"
            :src="item.url"
            :ratio="1"
            class="media-thumbnail"
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

          <!-- Selection Checkbox -->
          <q-checkbox
            v-if="selectionMode"
            :model-value="selectedMedia.includes(item.id)"
            class="absolute-top-left q-ma-xs"
            color="primary"
            @click.stop
            @update:model-value="toggleSelect(item)"
          />

          <!-- Overlay Actions -->
          <div class="media-overlay absolute-bottom q-pa-xs">
            <div class="row justify-between items-center">
              <span class="text-caption text-white ellipsis" style="max-width: 80%">
                {{ item.original_name || item.name }}
              </span>
              <q-btn
                round
                flat
                dense
                size="sm"
                icon="more_vert"
                color="white"
                @click.stop
              >
                <q-menu>
                  <q-list dense style="min-width: 120px">
                    <q-item clickable v-close-popup @click="viewMedia(item)">
                      <q-item-section avatar>
                        <q-icon name="visibility" size="xs" />
                      </q-item-section>
                      <q-item-section>View</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="copyUrl(item)">
                      <q-item-section avatar>
                        <q-icon name="content_copy" size="xs" />
                      </q-item-section>
                      <q-item-section>Copy URL</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="downloadMedia(item)">
                      <q-item-section avatar>
                        <q-icon name="download" size="xs" />
                      </q-item-section>
                      <q-item-section>Download</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="confirmDelete(item)">
                      <q-item-section avatar>
                        <q-icon name="delete" size="xs" color="negative" />
                      </q-item-section>
                      <q-item-section class="text-negative">Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- List View -->
    <q-table
      v-else
      :rows="media"
      :columns="columns"
      row-key="id"
      flat
      bordered
      selection="multiple"
      v-model:selected="selectedItems"
    >
      <template #body-cell-thumbnail="{ row }">
        <q-td>
          <q-img
            v-if="isImage(row)"
            :src="row.url"
            style="width: 50px; height: 50px"
            class="rounded-borders"
          />
          <q-icon v-else :name="getFileIcon(row)" size="32px" color="grey-6" />
        </q-td>
      </template>
      <template #body-cell-name="{ row }">
        <q-td>
          <span class="text-weight-medium">{{ row.original_name || row.name }}</span>
        </q-td>
      </template>
      <template #body-cell-size="{ row }">
        <q-td>{{ formatSize(row.size) }}</q-td>
      </template>
      <template #body-cell-created_at="{ row }">
        <q-td>{{ formatDate(row.created_at) }}</q-td>
      </template>
      <template #body-cell-actions="{ row }">
        <q-td>
          <q-btn flat round dense icon="visibility" size="sm" @click="viewMedia(row)">
            <q-tooltip>View</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="content_copy" size="sm" @click="copyUrl(row)">
            <q-tooltip>Copy URL</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="delete" size="sm" color="negative" @click="confirmDelete(row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Bulk Actions Bar -->
    <q-page-sticky v-if="selectedMedia.length > 0" position="bottom" :offset="[0, 18]">
      <q-banner class="bg-primary text-white rounded-borders shadow-2">
        <template v-slot:avatar>
          <q-icon name="check_circle" />
        </template>
        {{ selectedMedia.length }} item(s) selected
        <template v-slot:action>
          <q-btn flat label="Copy URLs" @click="copySelectedUrls" />
          <q-btn flat label="Delete" @click="deleteSelected" />
          <q-btn flat icon="close" @click="clearSelection" />
        </template>
      </q-banner>
    </q-page-sticky>

    <!-- Media Preview Dialog -->
    <q-dialog v-model="previewDialog" maximized>
      <q-card class="bg-black">
        <q-bar class="bg-grey-9">
          <div class="text-white">{{ previewItem?.original_name || previewItem?.name }}</div>
          <q-space />
          <q-btn dense flat icon="close" color="white" v-close-popup />
        </q-bar>
        <q-card-section class="flex flex-center" style="height: calc(100vh - 50px)">
          <q-img
            v-if="previewItem && isImage(previewItem)"
            :src="previewItem.url"
            fit="contain"
            style="max-height: 90vh; max-width: 90vw"
          />
          <video
            v-else-if="previewItem && isVideo(previewItem)"
            :src="previewItem.url"
            controls
            style="max-height: 90vh; max-width: 90vw"
          />
          <audio
            v-else-if="previewItem && isAudio(previewItem)"
            :src="previewItem.url"
            controls
          />
          <div v-else class="text-white text-center">
            <q-icon name="description" size="64px" />
            <div class="q-mt-md">Preview not available for this file type</div>
            <q-btn
              color="primary"
              label="Download"
              icon="download"
              class="q-mt-md"
              @click="downloadMedia(previewItem)"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Delete Media</div>
        </q-card-section>
        <q-card-section>
          Are you sure you want to delete "{{ deleteItem?.original_name || deleteItem?.name }}"? This action cannot be undone.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteMedia" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'MediaIndexPage'
})

const $q = useQuasar()

// State
const media = ref([])
const loading = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const viewMode = ref('grid')
const selectionMode = ref(false)
const selectedMedia = ref([])
const selectedItems = ref([])
const isDragging = ref(false)
const fileInput = ref(null)

// Dialogs
const previewDialog = ref(false)
const previewItem = ref(null)
const deleteDialog = ref(false)
const deleteItem = ref(null)

// Table columns for list view
const columns = [
  { name: 'thumbnail', label: '', field: 'thumbnail', align: 'left', style: 'width: 60px' },
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'type', label: 'Type', field: 'type', align: 'left', sortable: true },
  { name: 'size', label: 'Size', field: 'size', align: 'left', sortable: true },
  { name: 'created_at', label: 'Uploaded', field: 'created_at', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

onMounted(() => {
  fetchMedia()
})

// Methods
async function fetchMedia() {
  loading.value = true
  try {
    const result = await window.api.media.all()
    if (result.error) {
      throw new Error(result.error)
    }
    media.value = result
  } catch (err) {
    console.error('Failed to fetch media:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load media files'
    })
  } finally {
    loading.value = false
  }
}

function triggerUpload() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const files = event.target.files
  if (files.length > 0) {
    uploadFiles(Array.from(files))
  }
  // Reset input
  event.target.value = ''
}

function handleDrop(event) {
  isDragging.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    uploadFiles(Array.from(files))
  }
}

async function uploadFiles(files) {
  uploading.value = true
  uploadProgress.value = 0

  try {
    const totalFiles = files.length
    let uploadedCount = 0

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

      uploadedCount++
      uploadProgress.value = uploadedCount / totalFiles
    }

    $q.notify({
      type: 'positive',
      message: `${files.length} file(s) uploaded successfully`
    })
  } catch (err) {
    console.error('Upload failed:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to upload files: ' + err.message
    })
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

function toggleSelect(item) {
  const index = selectedMedia.value.indexOf(item.id)
  if (index === -1) {
    selectedMedia.value.push(item.id)
  } else {
    selectedMedia.value.splice(index, 1)
  }
}

function clearSelection() {
  selectedMedia.value = []
  selectedItems.value = []
}

function viewMedia(item) {
  previewItem.value = item
  previewDialog.value = true
}

function copyUrl(item) {
  navigator.clipboard.writeText(item.url)
  $q.notify({
    type: 'positive',
    message: 'URL copied to clipboard'
  })
}

function copySelectedUrls() {
  const urls = media.value
    .filter(m => selectedMedia.value.includes(m.id))
    .map(m => m.url)
    .join('\n')
  navigator.clipboard.writeText(urls)
  $q.notify({
    type: 'positive',
    message: `${selectedMedia.value.length} URL(s) copied to clipboard`
  })
}

function downloadMedia(item) {
  const link = document.createElement('a')
  link.href = item.url
  link.download = item.original_name || item.name
  link.click()
}

function confirmDelete(item) {
  deleteItem.value = item
  deleteDialog.value = true
}

async function deleteMedia() {
  try {
    const result = await window.api.media.delete(deleteItem.value.id)
    if (result.error) {
      throw new Error(result.error)
    }

    // Remove from list
    const index = media.value.findIndex(m => m.id === deleteItem.value.id)
    if (index !== -1) {
      media.value.splice(index, 1)
    }

    $q.notify({
      type: 'positive',
      message: 'Media deleted successfully'
    })
  } catch (err) {
    console.error('Delete failed:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to delete media'
    })
  } finally {
    deleteDialog.value = false
    deleteItem.value = null
  }
}

async function deleteSelected() {
  try {
    const result = await window.api.media.bulkDelete(selectedMedia.value)
    if (result.error) {
      throw new Error(result.error)
    }

    // Remove from list
    media.value = media.value.filter(m => !selectedMedia.value.includes(m.id))

    $q.notify({
      type: 'positive',
      message: `${selectedMedia.value.length} item(s) deleted`
    })

    clearSelection()
  } catch (err) {
    console.error('Bulk delete failed:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to delete selected items'
    })
  }
}

// Helpers
function isImage(item) {
  return item.type === 'image' || item.mime_type?.startsWith('image/')
}

function isVideo(item) {
  return item.type === 'video' || item.mime_type?.startsWith('video/')
}

function isAudio(item) {
  return item.type === 'audio' || item.mime_type?.startsWith('audio/')
}

function getFileIcon(item) {
  if (isImage(item)) return 'image'
  if (isVideo(item)) return 'videocam'
  if (isAudio(item)) return 'audiotrack'
  if (item.mime_type?.includes('pdf')) return 'picture_as_pdf'
  if (item.mime_type?.includes('word') || item.mime_type?.includes('document')) return 'description'
  return 'insert_drive_file'
}

function formatSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Expose methods for external use (e.g., product thumbnail selection)
defineExpose({
  media,
  selectedMedia,
  getSelectedMedia: () => media.value.filter(m => selectedMedia.value.includes(m.id))
})
</script>

<style scoped lang="scss">
.upload-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover,
  &.drag-over {
    border-color: var(--q-primary);
    background-color: rgba(var(--q-primary-rgb), 0.05);
  }
}

.media-card {
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

.media-thumbnail {
  aspect-ratio: 1;
}

.media-placeholder {
  aspect-ratio: 1;
  background-color: #f5f5f5;
}

.media-overlay {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.media-card:hover .media-overlay {
  opacity: 1;
}
</style>
