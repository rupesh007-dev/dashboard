import 'dotenv/config';
import { app, BrowserWindow, ipcMain } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';
const APP_ROOT = join(__dirname, '..');
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const RENDERER_DIST = join(APP_ROOT, 'dist');

const preloadPath = isDev
  ? join(__dirname, 'preload.js')
  : join(process.resourcesPath, 'app.asar.unpacked', 'dist-electron', 'preload.js');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: join(APP_ROOT, 'public', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
      webSecurity: !isDev,
    },
    show: false,
  });

  mainWindow.setMenu(null);

  if (isDev && VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(RENDERER_DIST, 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Check for updates as soon as window is ready (only in prod)
    if (!isDev) {
      autoUpdater.checkForUpdates();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// --- Auto Updater Logic ---

// 1. FREEZE AUTO DOWNLOAD (Crucial for your "Ask User" requirement)
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// 2. Events to send to React
autoUpdater.on('update-available', (info) => {
  mainWindow?.webContents.send('update-available', info);
});

autoUpdater.on('update-not-available', () => {
  mainWindow?.webContents.send('update-not-available');
});

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow?.webContents.send('download-progress', progressObj);
});

autoUpdater.on('update-downloaded', () => {
  mainWindow?.webContents.send('update-downloaded');
});

autoUpdater.on('error', (error) => {
  mainWindow?.webContents.send('update-error', error.message);
});

// 3. IPC Handlers (React calls these)
ipcMain.handle('check-for-updates', async () => {
  if (isDev) return null;
  return await autoUpdater.checkForUpdates();
});

ipcMain.handle('download-update', async () => {
  return await autoUpdater.downloadUpdate();
});

ipcMain.handle('quit-and-install', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle('get-version', () => {
  return app.getVersion();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});