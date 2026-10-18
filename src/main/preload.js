const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
    isDesktop: true,
    version: process.env.npm_package_version || '1.0.0',
    platform: process.platform,
});