'use strict';

import './set-cwd';
import electron, { app, BrowserWindow } from 'electron';
import config from 'config';
import { resolve } from 'path';

export default () => {
  let window;

  const createWindow = () => {
    window = new BrowserWindow;
    window.maximize();
    window.loadURL(`file://${resolve(__dirname, 'window/index.html')}`);
    window.on('closed', () => window = null);

    if (process.env['NODE_ENV'] === 'development') {
      window.webContents.openDevTools();
    }
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
