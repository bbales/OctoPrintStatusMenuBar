const { ipcRenderer } = require('electron')

class Notification {
    static printComplete() {
        let data = {
            message: 'Job Complete',
            title: 'OctoPrint Status',
            subtitle: 'sldrprt.gcode'
        }
        ipcRenderer.send('notification', data)
    }

    static printFailed() {

    }

    static custom(arg) {

    }
}
