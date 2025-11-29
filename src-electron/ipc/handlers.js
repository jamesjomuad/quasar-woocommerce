import { ipcMain } from 'electron';
import UserModel from '../db/models/User.js'


export function setupIPCHandlers() {
  ipcMain.handle('user:all', async () => {
    try {
      console.log('IPC: Received request to fetch all users (user:all).')
      const users = await UserModel.all()
      return users
    } catch (error) {
      console.error('IPC Handler (user:all) failed:', error)
      // Return a structured error object back to the renderer
      return { error: error.message }
    }
  })

  console.log('✅ IPC Handlers registered.');
}
