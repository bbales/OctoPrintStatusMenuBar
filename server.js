const { ipcMain, shell, app } = require('electron')
const notifier = require('node-notifier')
const path = require('path')

// Open external URL
ipcMain.on('open-in-browser', (event, arg) => arg !== null && shell.openExternal(arg))

// Quit application
ipcMain.on('quit', () => app.quit())

// Create the menubar app
const mb = require('menubar')({ dir: 'app/', alwaysOnTop: true, preloadWindow: true, height: 250, icon: 'app/icon.png' })

// Prime that espresso when the menubar application is ready
mb.on('ready', () => {
    mb.showWindow();
    mb.shown = true
})

// Hide it when the user clicks away
mb.on('focus-lost', () => {
    mb.hideWindow();
    mb.shown = false
})

// Focus on the window whenever it is shown
mb.on('after-show', () => {
    mb.window.focus();
    mb.shown = true
})

let nc = new notifier.NotificationCenter()

ipcMain.on('notification', (e, arg) => {
    if (!mb.shown)
        nc.notify({
            title: arg.title,
            subtitle: arg.subtitle,
            message: arg.message,
            wait: true,
            appIcon: path.join(__dirname, 'app/icon.png'),
            contentImage: path.join(__dirname, 'app/icon.png'),
            // open: 'file://' + path.join(__dirname, 'coulson.jpg')
        })
})
