/*
 * Virtual FISO Strips application
 * Copyright (C) 2023 Vionity Ltd
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program. If not, see
 * <https://www.gnu.org/licenses/>.
 */

const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const { join } = require('node:path');

if (app.requestSingleInstanceLock()) {
    init();
} else {
    app.quit();
}

async function init() {
    let topWindow;
    let topWindowTitle = 'FISO Strips';
    
    const createWindow = (title, page, width, height, openDevTools) => {
        topWindowTitle = title;

        const mainWindow = new BrowserWindow({
            height: height,
            minHeight: height,
            width: width,
            minWidth: 750,
            //maxWidth: width,
            maximizable: true,
            alwaysOnTop: false,
            title: `${title} - v${app.getVersion()}`,
            darkTheme: true,
            autoHideMenuBar: true,
            fullscreenable: false,
            webPreferences: {
                preload: join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: true,
                spellcheck: false,
                autoplayPolicy: 'no-user-gesture-required',
                allowRunningInsecureContent: false,
                safeDialogs: false,
                devTools: !app.isPackaged,
            },
        });
    
        mainWindow.loadURL(join(__dirname, page));
    
        if (!app.isPackaged && openDevTools) {
            mainWindow.webContents.openDevTools();
        }

        return mainWindow;
    };

    app.whenReady().then(() => {
        app.on('second-instance', () => {
            if (topWindow) {
                if (topWindow.isMinimized()) {
                    topWindow.restore();
                }
                topWindow.focus();
            }
        });

        if (app.isPackaged) {
            autoUpdater.on('update-available', () => {
                if (topWindow) {
                    topWindow.setTitle(`${topWindowTitle} - v${app.getVersion()} - Updating...`);
                }
            });

            autoUpdater.on('download-progress', (progress) => {
                if (topWindow) {
                    const MBs = Math.floor(progress.bytesPerSecond / 1_000_000);
                    topWindow.setTitle(`${topWindowTitle} - v${app.getVersion()} - Updating at ${MBs.toFixed(1)} MB/s...`);
                }
            });
    
            autoUpdater.on('update-downloaded', (event) => {
                if (topWindow) {
                    topWindow.setTitle(`${topWindowTitle} - v${app.getVersion()} - Restart to apply updates`);
                }
                const dialogOpts = {
                    type: 'info',
                    buttons: ['Restart now', 'Later'],
                    title: `Ready to update from v${app.getVersion()} to v${event.version}`,
                    message: 'An update is ready to install',
                    detail: 'A new version of FISO Strips has been downloaded. The updates will be applied when you restart FISO Strips. Would you like to do that now?',
                };
                dialog.showMessageBox(dialogOpts).then((returnValue) => {
                    if (returnValue.response === 0) {
                        autoUpdater.quitAndInstall();
                    }
                });
            });
    
            autoUpdater.on('error', (message) => {
                console.error('There was a problem updating the application.');
                console.error(message);
                if (topWindow) {
                    topWindow.setTitle(`${topWindowTitle} - v${app.getVersion()} - Update failed`);
                }
            });

            setInterval(runUpdateCheck, 60_000);
            runUpdateCheck();

            function runUpdateCheck() {
                autoUpdater.checkForUpdates();
            }
        }

        topWindow = createWindow('FISO Strips', 'static/pages/index/index.html', 1467, 516, true);
    });
};
