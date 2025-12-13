import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 🧭 Toolbar
  const title = ref('VueCommerce')
  const subtitle = ref('')

  // 🎨 Layout and Theme
  const layout = ref('drawer') // or 'drawer'
  const darkMode = ref(false)
  const isDrawer = ref(layout.value === 'drawer')
  const isTile = ref(layout.value === 'tile')

  // ⏳ Loading / Busy State
  const loading = ref(false)

  // 💬 Generic notification or message
  const message = ref(null)

  // --- Actions ---
  const setTitle    = (newTitle) => title.value = newTitle
  const setSubtitle = (newSubtitle) => subtitle.value = newSubtitle
  const setLayout   = (mode) => layout.value = mode
  const toggleLayout = () => layout.value = layout.value === 'tile' ? 'drawer' : 'tile'
  const setLoading  = (state) => loading.value = state
  const setMessage  = (msg) => message.value = msg

  return {
    // state
    title,
    subtitle,
    layout,
    isDrawer,
    isTile,
    darkMode,
    loading,
    message,
    // actions
    setTitle,
    setSubtitle,
    setLayout,
    toggleLayout,
    setLoading,
    setMessage
  }
})
