import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
  getAppVersion: () => ipcRenderer.invoke('get-version'),

  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (_, args) => callback(args)),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', (_, args) => callback(args)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', (_, args) => callback(args)),
  onUpdateError: (callback) => ipcRenderer.on('update-error', (_, args) => callback(args)),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (_, args) => callback(args)),
  
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);