import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  // User
  user: {
    all: () => ipcRenderer.invoke('user:all'),
    find: (payload) => ipcRenderer.invoke('user:find', payload),
    create: (payload) => ipcRenderer.invoke('user:create', payload),
  },

  // Authentication
  auth:{
    login: (payload) => ipcRenderer.invoke('auth:login', payload),
  }
})
