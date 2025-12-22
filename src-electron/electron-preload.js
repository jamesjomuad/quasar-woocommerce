import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  close: () => ipcRenderer.send('win:close'),

  // User
  user: {
    all: () => ipcRenderer.invoke('user:all'),
    find: (payload) => ipcRenderer.invoke('user:find', payload),
    create: (payload) => ipcRenderer.invoke('user:create', payload),
  },

  // Authentication
  auth: {
    login: (payload) => ipcRenderer.invoke('auth:login', payload),
  },

  // Product
  product: {
    all: () => ipcRenderer.invoke('product:all'),
    paginate: (payload) => ipcRenderer.invoke('product:paginate', payload),
    find: (payload) => ipcRenderer.invoke('product:find', payload),
    create: (payload) => ipcRenderer.invoke('product:create', payload),
    update: (id, data) => ipcRenderer.invoke('product:update', { id, data }),
    delete: (id) => ipcRenderer.invoke('product:delete', id),
    forceDelete: (id) => ipcRenderer.invoke('product:forceDelete', id),
  },

  // Media
  media: {
    all: () => ipcRenderer.invoke('media:all'),
    paginate: (payload) => ipcRenderer.invoke('media:paginate', payload),
    find: (payload) => ipcRenderer.invoke('media:find', payload),
    byType: (type) => ipcRenderer.invoke('media:byType', type),
    search: (keyword) => ipcRenderer.invoke('media:search', keyword),
    upload: (payload) => ipcRenderer.invoke('media:upload', payload),
    uploadMultiple: (files) => ipcRenderer.invoke('media:uploadMultiple', files),
    update: (id, data) => ipcRenderer.invoke('media:update', { id, data }),
    delete: (id) => ipcRenderer.invoke('media:delete', id),
    forceDelete: (id) => ipcRenderer.invoke('media:forceDelete', id),
    bulkDelete: (ids) => ipcRenderer.invoke('media:bulkDelete', ids),
    getUploadsPath: () => ipcRenderer.invoke('media:getUploadsPath'),
  },
})
