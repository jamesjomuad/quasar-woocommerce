import { ipcMain } from 'electron';
import UserModel from '../db/models/User.js'


export function setupIPCHandlers() {
  // user:all
  ipcMain.handle('user:all', async () => {
    try {
      return await UserModel.all()
    } catch (error) {
      return { error: error.message }
    }
  })

  // user:find
  ipcMain.handle('user:find', async (event, payload) => {
    try {
      return await UserModel.find(payload)
    } catch (error) {
      return { error: error.message }
    }
  })

  // user:create
  ipcMain.handle('user:create', async (event, payload) => {
    try {
      return await UserModel.create(payload)
    } catch (error) {
      return { error: error.message }
    }
  })

  // auth:login
  ipcMain.handle('auth:login', async (event, { username, password }) => {
    try {
      // 1. Fetch the user from the database.
      // Assuming User.find() returns an object containing the 'password' hash.
      const userRecord = await UserModel.find({ username: username });

      if (!userRecord) {
        return { success: false, message: 'Invalid credentials.' };
      }

      const storedHash = userRecord.password; // Get the stored hash

      // 2. Call the validation method on the User instance.
      const isMatch = await UserModel.validPassword(password, storedHash);

      if (isMatch) {
        // Remove the sensitive hash before sending data back.
        delete userRecord.password;
        return { success: true, data: userRecord, message: 'Login successful.' };
      } else {
        return { success: false, message: 'Invalid credentials.' };
      }
    } catch (error) {
      console.error('Login Handler Error:', error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  });

  console.log('✅ IPC Handlers registered.');
}
