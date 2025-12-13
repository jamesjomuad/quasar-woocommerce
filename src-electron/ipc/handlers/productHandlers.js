import { ipcMain } from 'electron';
import ProductModel from '../../db/models/Product.js';

/**
 * Register all product-related IPC handlers
 */
export function registerProductHandlers() {
  // product:all - Get all products
  ipcMain.handle('product:all', async () => {
    try {
      return await ProductModel.all();
    } catch (error) {
      return { error: error.message };
    }
  });

  // product:paginate - Get paginated products
  ipcMain.handle('product:paginate', async (event, { page = 1, perPage = 10 }) => {
    try {
      return await ProductModel.paginate(page, perPage);
    } catch (error) {
      return { error: error.message };
    }
  });

  // product:find - Find a product by criteria
  ipcMain.handle('product:find', async (event, payload) => {
    try {
      return await ProductModel.find(payload);
    } catch (error) {
      return { error: error.message };
    }
  });

  // product:create - Create a new product
  ipcMain.handle('product:create', async (event, payload) => {
    try {
      return await ProductModel.create(payload);
    } catch (error) {
      return { error: error.message };
    }
  });

  // product:update - Update an existing product
  ipcMain.handle('product:update', async (event, { id, data }) => {
    try {
      return await ProductModel.update(id, data);
    } catch (error) {
      return { error: error.message };
    }
  });

  // product:delete - Soft delete a product
  ipcMain.handle('product:delete', async (event, id) => {
    try {
      await ProductModel.delete(id);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  });

  // product:forceDelete - Permanently delete a product
  ipcMain.handle('product:forceDelete', async (event, id) => {
    try {
      await ProductModel.forceDelete(id);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  });

  console.log('  ↳ Product handlers registered');
}
