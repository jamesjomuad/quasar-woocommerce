import { ipcMain } from 'electron';
import UserModel from '../../db/models/User.js';

/**
 * Register all user-related IPC handlers
 */
export function registerUserHandlers() {
  // user:all - Get all users
  ipcMain.handle('user:all', async () => {
    try {
      return await UserModel.all();
    } catch (error) {
      return { error: error.message };
    }
  });

  // user:find - Find a user by criteria
  ipcMain.handle('user:find', async (event, payload) => {
    try {
      return await UserModel.find(payload);
    } catch (error) {
      return { error: error.message };
    }
  });

  // user:create - Create a new user
  ipcMain.handle('user:create', async (event, payload) => {
    try {
      return await UserModel.create(payload);
    } catch (error) {
      return { error: error.message };
    }
  });

  console.log('  ↳ User handlers registered');
}
