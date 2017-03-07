const { ipcMain } = require('electron')
ipcMain.on('open-in-browser', (event, arg) => {
    const { shell } = require('electron')
    console.log(arg)
    if (arg !== null) shell.openExternal(arg)
})

// Create the menubar app
const mb = require('menubar')({ dir: 'app/', alwaysOnTop: true, preloadWindow: true, height: 250, icon: 'app/icon.png' })

// Prime that espresso when the menubar application is ready
mb.on('ready', () => mb.showWindow())

// Hide it when the user clicks away
mb.on('focus-lost', () => mb.hideWindow())

// Focus on the window whenever it is shown
mb.on('after-show', () => mb.window.focus())
