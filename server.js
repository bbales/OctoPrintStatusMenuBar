// Create the menubar app
const mb = require('menubar')({ dir: 'app/', alwaysOnTop: true, preloadWindow: true })

// Prime that espresso when the menubar application is ready
mb.on('ready', () => mb.showWindow())

// Hide it when the user clicks away
// mb.on('focus-lost', () => mb.hideWindow())

// Focus on the window whenever it is shown
mb.on('after-show', () => mb.window.focus())
