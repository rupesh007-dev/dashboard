import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import { autoUpdater } from 'electron-updater' // 1. Import autoUpdater
import icon from '../../public/icon.png?asset'
// import { autoUpdater } from 'electron-updater'


import pkg from "electron-updater"
const  { autoUpdater} =pkg

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    
    // Open DevTools in development
    if (is.dev) {
      mainWindow.webContents.openDevTools()
    } else {
      // 2. Check for updates automatically in production
      autoUpdater.checkForUpdatesAndNotify()
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 3. Handle Auto-Updater Events (Optional but Recommended)
autoUpdater.on('update-available', () => {
  console.log('Update available.')
})

autoUpdater.on('update-downloaded', () => {
  // Tells the app to restart and install the update immediately
  autoUpdater.quitAndInstall()
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.revvknew.dashboard')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))
  
  createWindow()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})