import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import { connect } from './db/connect.js'
import path from 'node:path'
import os from 'node:os'
import { setupIPCHandlers } from './ipc/handlers.js'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';


// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

const currentDir = fileURLToPath(new URL('.', import.meta.url))

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
      contextIsolation: true,
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

  if (process.env.DEBUGGING) {
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
    const devCSP = `
      default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: filesystem:
      https://blessed-rainbow-1772ab4251.strapiapp.com;
    `

    const prodCSP = `
      default-src 'self' data: blob:
      https://blessed-rainbow-1772ab4251.strapiapp.com;
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      connect-src 'self' https://blessed-rainbow-1772ab4251.strapiapp.com;
      img-src 'self' data: blob: https://blessed-rainbow-1772ab4251.strapiapp.com;
    `
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
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

app.whenReady().then(async ()=>{
  await installVueDevtools();
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
