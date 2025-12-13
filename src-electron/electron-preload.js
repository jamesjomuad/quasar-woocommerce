import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
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
  }
})
