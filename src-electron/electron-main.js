import { app, BrowserWindow, protocol, net } from 'electron'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'url'
import { connect } from './db/connect.js'
import { setupIPCHandlers } from './ipc/handlers.js'
import fs from 'fs'
import path from 'node:path'
import os from 'node:os'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';


// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

const uploadsDir = path.resolve(app.getPath('userData'), 'uploads')

const currentDir = fileURLToPath(new URL('.', import.meta.url))

const CUSTOM_SCHEME = 'local-file'

let mainWindow

let knex = null

async function migrate(db) {
  try {
    // Run all pending migrations
    await db.migrate.latest()
    console.log('Database migrations completed successfully.')
  } catch (error) {
    console.error('Database migration failed:', error)
    // Handle error (e.g., quit the app or show a critical error message)
    app.quit()
  }
}

async function installVueDevtools() {
  if (process.env.DEV) { // Only run in development mode
    try {
      const name = await installExtension(VUEJS_DEVTOOLS);
      console.log(`✅ Added Extension: ${name}`);
    } catch (error) {
      console.error('An error occurred installing Vue Devtools:', error);
    }
  }
}

async function createWindow() {
  // 1. Connect to the database
  knex = connect()

  // 2. Run migrations before loading the app content
  await migrate(knex)

  // 3. CRUCIAL: Set up IPC handlers after the DB is ready
  setupIPCHandlers()

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // This line added to prevent the problem.
      enableRemoteModule: true, // add this line to fix 'Uncaught Error: Error in "main" process' error messages
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
        ),
      ),
    },
  })

  // Maximize on launch
  mainWindow.maximize()
  mainWindow.removeMenu()

  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL)
  } else {
    await mainWindow.loadFile('index.html')
  }

  if (process.env.DEV || process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const isDev = !app.isPackaged

  // Add CSP header
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    // DEV CSP: Generally allows more for hotswapping and debugging.
    const devCSP = `
      default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: filesystem: **local-file:**
      https://blessed-rainbow-1772ab4251.strapiapp.com;
      **img-src 'self' data: blob: filesystem: local-file:;**
    `

    // PROD CSP: Should be much tighter for security.
    const prodCSP = `
      default-src 'self' data: blob: **local-file:**
      https://blessed-rainbow-1772ab4251.strapiapp.com;
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      connect-src 'self' https://blessed-rainbow-1772ab4251.strapiapp.com;
      img-src 'self' data: blob: **local-file:** https://blessed-rainbow-1772ab4251.strapiapp.com;
    `
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          // Using .replace(/\s+/g, ' ') is good practice to clean up the multi-line string.
          isDev ? devCSP.replace(/\s+/g, ' ') : prodCSP.replace(/\s+/g, ' '),
        ],
      },
    })
})

  mainWindow.on('closed', () => {
    mainWindow = null
    knex.destroy()
  })
} // createWindow

protocol.registerSchemesAsPrivileged([
  {
    scheme: CUSTOM_SCHEME,
    privileges: {
      // Required: Treat the protocol as secure and standard
      secure: true,
      standard: true,

      // Recommended for asset loading (images, scripts, etc.)
      supportFetchAPI: true,
      bypassCSP: true, // Helps the renderer process trust the protocol
      corsEnabled: true,
    }
  }
])

app.whenReady().then(async () => {
  protocol.handle('local-file', (request) => {
    // 1. Use URL parsing instead of string replacement
    const url = new URL(request.url)

    // 2. decodeURIComponent handles spaces/symbols
    // url.pathname handles the slash logic (on Windows it drops the extra slash usually)
    let rawPath = decodeURIComponent(url.pathname)

    // Windows Fix: url.pathname might still return "/C:/..." on some versions.
    // If on Windows and starts with /X:/, strip the first slash.
    if (process.platform === 'win32' && /^\/[a-zA-Z]:/.test(rawPath)) {
      rawPath = rawPath.slice(1)
    }

    const resolvedPath = path.resolve(rawPath)

    // 3. Security Check (Excellent!)
    if (!resolvedPath.startsWith(uploadsDir)) {
      return new Response('Forbidden', { status: 403 })
    }

    // 4. Existence Check
    if (!fs.existsSync(resolvedPath)) {
      return new Response('Not Found', { status: 404 })
    }

    // 5. Serve the file
    // 'net.fetch' is generally preferred in Electron over global 'fetch'
    // for protocol handling, though both often work.
    return net.fetch(pathToFileURL(resolvedPath).toString())
  })

  await installVueDevtools()
  createWindow()
})

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
