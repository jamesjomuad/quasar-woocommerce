import { ipcMain, app } from 'electron';
import MediaModel from '../../db/models/Media.js';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Get the uploads directory path
function getUploadsDir() {
  const userDataPath = app.getPath('userData');
  const uploadsDir = path.join(userDataPath, 'uploads');

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  return uploadsDir;
}

// Generate unique filename
function generateUniqueFilename(originalName) {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  return `${baseName}-${timestamp}-${random}${ext}`;
}

// Get media type from mime type
function getMediaType(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
}

/**
 * Register all media-related IPC handlers
 */
export function registerMediaHandlers() {
  // media:all - Get all media files
  ipcMain.handle('media:all', async () => {
    try {
      const media = await MediaModel.all();
      return media;
    } catch (error) {
      console.error('media:all error:', error);
      return { error: error.message };
    }
  });

  // media:paginate - Get paginated media files
  ipcMain.handle('media:paginate', async (event, { page = 1, perPage = 20 }) => {
    try {
      return await MediaModel.paginate(page, perPage);
    } catch (error) {
      console.error('media:paginate error:', error);
      return { error: error.message };
    }
  });

  // media:find - Find a media file by ID
  ipcMain.handle('media:find', async (event, payload) => {
    try {
      return await MediaModel.find(payload);
    } catch (error) {
      console.error('media:find error:', error);
      return { error: error.message };
    }
  });

  // media:byType - Get media by type (image, video, audio, document)
  ipcMain.handle('media:byType', async (event, type) => {
    try {
      return await MediaModel.getAllByType(type);
    } catch (error) {
      console.error('media:byType error:', error);
      return { error: error.message };
    }
  });

  // media:search - Search media by name
  ipcMain.handle('media:search', async (event, keyword) => {
    try {
      return await MediaModel.search(keyword);
    } catch (error) {
      console.error('media:search error:', error);
      return { error: error.message };
    }
  });

  // media:upload - Upload a media file
  ipcMain.handle('media:upload', async (event, { buffer, name, mimeType, size }) => {
    try {
      const uploadsDir = getUploadsDir();
      const filename = generateUniqueFilename(name);
      const filePath = path.join(uploadsDir, filename);
      const extension = path.extname(name).slice(1).toLowerCase();
      const type = getMediaType(mimeType);

      // Write file to disk
      const fileBuffer = Buffer.from(buffer);
      fs.writeFileSync(filePath, fileBuffer);

      // Create media record
      const mediaData = {
        name: path.basename(name, path.extname(name)),
        original_name: name,
        filename: filename,
        path: filePath,
        url: `file://${filePath}`,
        mime_type: mimeType,
        type: type,
        extension: extension,
        size: size
      };

      // Get image dimensions if it's an image
      if (type === 'image') {
        try {
          // Basic dimension detection for common formats
          const dimensions = getImageDimensions(fileBuffer, mimeType);
          if (dimensions) {
            mediaData.width = dimensions.width;
            mediaData.height = dimensions.height;
          }
        } catch (dimError) {
          console.warn('Could not get image dimensions:', dimError);
        }
      }

      const media = await MediaModel.create(mediaData);
      return media;
    } catch (error) {
      console.error('media:upload error:', error);
      return { error: error.message };
    }
  });

  // media:uploadMultiple - Upload multiple media files
  ipcMain.handle('media:uploadMultiple', async (event, files) => {
    try {
      const results = [];

      for (const file of files) {
        const uploadsDir = getUploadsDir();
        const filename = generateUniqueFilename(file.name);
        const filePath = path.join(uploadsDir, filename);
        const extension = path.extname(file.name).slice(1).toLowerCase();
        const type = getMediaType(file.mimeType);

        // Write file to disk
        const fileBuffer = Buffer.from(file.buffer);
        fs.writeFileSync(filePath, fileBuffer);

        // Create media record
        const mediaData = {
          name: path.basename(file.name, path.extname(file.name)),
          original_name: file.name,
          filename: filename,
          path: filePath,
          url: `file://${filePath}`,
          mime_type: file.mimeType,
          type: type,
          extension: extension,
          size: file.size
        };

        // Get image dimensions if it's an image
        if (type === 'image') {
          try {
            const dimensions = getImageDimensions(fileBuffer, file.mimeType);
            if (dimensions) {
              mediaData.width = dimensions.width;
              mediaData.height = dimensions.height;
            }
          } catch (dimError) {
            console.warn('Could not get image dimensions:', dimError);
          }
        }

        const media = await MediaModel.create(mediaData);
        results.push(media);
      }

      return results;
    } catch (error) {
      console.error('media:uploadMultiple error:', error);
      return { error: error.message };
    }
  });

  // media:update - Update media metadata
  ipcMain.handle('media:update', async (event, { id, data }) => {
    try {
      return await MediaModel.update(id, data);
    } catch (error) {
      console.error('media:update error:', error);
      return { error: error.message };
    }
  });

  // media:delete - Soft delete a media file
  ipcMain.handle('media:delete', async (event, id) => {
    try {
      await MediaModel.delete(id);
      return { success: true };
    } catch (error) {
      console.error('media:delete error:', error);
      return { error: error.message };
    }
  });

  // media:forceDelete - Permanently delete a media file (including the actual file)
  ipcMain.handle('media:forceDelete', async (event, id) => {
    try {
      // Get the media record first to get the file path
      const media = await MediaModel.find(id);
      if (media && media.path) {
        // Delete the actual file
        if (fs.existsSync(media.path)) {
          fs.unlinkSync(media.path);
        }
      }

      // Delete from database
      await MediaModel.forceDelete(id);
      return { success: true };
    } catch (error) {
      console.error('media:forceDelete error:', error);
      return { error: error.message };
    }
  });

  // media:bulkDelete - Delete multiple media files
  ipcMain.handle('media:bulkDelete', async (event, ids) => {
    try {
      for (const id of ids) {
        await MediaModel.delete(id);
      }
      return { success: true, deleted: ids.length };
    } catch (error) {
      console.error('media:bulkDelete error:', error);
      return { error: error.message };
    }
  });

  // media:getUploadsPath - Get the uploads directory path
  ipcMain.handle('media:getUploadsPath', async () => {
    try {
      return getUploadsDir();
    } catch (error) {
      console.error('media:getUploadsPath error:', error);
      return { error: error.message };
    }
  });

  console.log('  ↳ Media handlers registered');
}

/**
 * Simple image dimension detection for common formats
 * For more robust detection, consider using a library like 'image-size'
 */
function getImageDimensions(buffer, mimeType) {
  try {
    // PNG
    if (mimeType === 'image/png') {
      if (buffer.length >= 24 && buffer.toString('hex', 0, 8) === '89504e470d0a1a0a') {
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        return { width, height };
      }
    }

    // JPEG
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break;

        const marker = buffer[offset + 1];

        // SOF markers
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }

        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    }

    // GIF
    if (mimeType === 'image/gif') {
      if (buffer.length >= 10 && buffer.toString('ascii', 0, 3) === 'GIF') {
        const width = buffer.readUInt16LE(6);
        const height = buffer.readUInt16LE(8);
        return { width, height };
      }
    }

    // WebP
    if (mimeType === 'image/webp') {
      if (buffer.length >= 30 && buffer.toString('ascii', 0, 4) === 'RIFF') {
        // VP8 format
        if (buffer.toString('ascii', 12, 16) === 'VP8 ') {
          const width = buffer.readUInt16LE(26) & 0x3fff;
          const height = buffer.readUInt16LE(28) & 0x3fff;
          return { width, height };
        }
        // VP8L format
        if (buffer.toString('ascii', 12, 16) === 'VP8L') {
          const bits = buffer.readUInt32LE(21);
          const width = (bits & 0x3fff) + 1;
          const height = ((bits >> 14) & 0x3fff) + 1;
          return { width, height };
        }
      }
    }

    return null;
  } catch (e) {
    console.warn('Error getting image dimensions:', e);
    return null;
  }
}
