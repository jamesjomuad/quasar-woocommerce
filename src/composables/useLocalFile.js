import { computed } from 'vue'

export function useLocalFile() {
  /**
   * Normalize any local path → valid local-file:// URL
   */
  function toLocalUrl(filePath) {
    if (!filePath || typeof filePath !== 'string') return ''

    // 1️⃣ Normalize Windows backslashes
    let normalized = filePath.replace(/\\/g, '/')

    // 2️⃣ Remove accidental leading file://
    normalized = normalized.replace(/^file:\/+/, '')

    // 3️⃣ Ensure absolute path (Windows drive)
    if (!/^[a-zA-Z]:\//.test(normalized)) {
      console.warn('[useLocalFile] Path is not absolute:', filePath)
    }

    // 4️⃣ Encode spaces & unicode
    const encodedPath = encodeURI(normalized)

    return `local-file://${encodedPath}`
  }

  /**
   * Detect file type from path
   */
  function getFileType(filePath) {
    if (!filePath) return null

    const ext = filePath.split('.').pop()?.toLowerCase()

    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image'
    if (ext === 'pdf') return 'pdf'
    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video'

    return 'unknown'
  }

  /**
   * Vue-friendly computed helpers
   */
  function useFile(filePath) {
    const url = computed(() => toLocalUrl(filePath))
    const type = computed(() => getFileType(filePath))

    return {
      url,
      type,
      isImage: computed(() => type.value === 'image'),
      isPDF: computed(() => type.value === 'pdf'),
      isVideo: computed(() => type.value === 'video')
    }
  }

  return {
    toLocalUrl,
    getFileType,
    useFile
  }
}
