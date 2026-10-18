const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');
const { isInternalNavigation } = require('./navigation');

const isDev = process.argv.includes('--devtools');
const rendererDir = path.join(__dirname, '..', 'renderer');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 860, 
        minWidth: 940, 
        minHeight: 640,
        backgroundColor: '#F8F6EC',
        title: 'NusantaraExpress',
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    win.once('ready-to-show', () => {
        win.show();
        if (isDev) win.webContents.openDevTools({ mode: 'detach' });
    });

    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    win.webContents.on('will-navigate', (event, url) => {
        if (!isInternalNavigation(url)) event.preventDefault();
    });

    win.loadFile(path.join(rendererDir, 'index.html'));
}

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
    // without this the terminal looks identical to a successful launch that drew no
    // window: another instance (often the packaged.exe) already owns the lock.
    console.log('NusantaraExpress sudah berjalan. Jendela yang ada sudah difokuskan, tutup instance itu dulu sebelum npm start.');
    app.quit();
} else {
    app.on('second-instance', () => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });

    app.whenReady().then(() => {
        createWindow();
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});