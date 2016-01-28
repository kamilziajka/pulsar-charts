'use strict';

import electron, { app, BrowserWindow } from 'electron';
import config from 'config';
import { resolve } from 'path';

export default () => {
  const options = config.get('window');
  let window;

  const createWindow = () => {
    window = new BrowserWindow(options);
    window.webContents.openDevTools();
    window.loadURL(`file://${resolve(__dirname, 'window/index.html')}`);
    window.on('closed', () => window = null);
  };

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (window === null) {
      createWindow();
    }
  });
}
