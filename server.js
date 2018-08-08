const { ipcMain, shell, app, Menu } = require('electron')
const notifier = require('node-notifier')
const path = require('path')
const defaultMenu = require('electron-default-menu');
const appPath = __dirname

// Create the menubar app
const mb = require('menubar')({
    dir: appPath + '/app/',
    alwaysOnTop: true,
    preloadWindow: true,
    height: 250,
    icon: appPath + '/app/icon.png'
})

var disableHide = false

mb.on('ready', () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(defaultMenu(app, shell)));
  mb.showWindow()
})
// mb.on('ready', () => mb.window.toggleDevTools())

// Hide it when the user clicks away
mb.on('focus-lost', () => !disableHide && mb.hideWindow())

// Focus on the window whenever it is shown
mb.on('after-show', () => mb.window.focus())

// Open external URL
ipcMain.on('open-in-browser', (e, arg) => arg !== null && shell.openExternal(arg))

// Quit application
ipcMain.on('quit', () => app.quit())

// Disable hide (for things like upload)
ipcMain.on('disable-hide', (e, arg = true) => {
    disableHide = arg
    if (!arg) mb.window.focus()
})

// Notifications
ipcMain.on('notification', (e, arg) => {
    if (!mb.window.isVisible()) notifier.notify(Object.assign(arg, {
        wait: true,
        appIcon: path.join(__dirname, 'app/icon.png'),
        contentImage: path.join(__dirname, 'app/icon.png'),
    }))
})
