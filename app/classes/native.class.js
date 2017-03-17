class Native {
    static set notificationsEnabled(v) { localStorage.setItem('notifications-enabled', v) }
    static get notificationsEnabled() { return localStorage.getItem('notifications-enabled') }

    static printComplete() {
        if (!Native.notificationsEnabled) return
        let data = {
            message: 'Job Complete',
            title: 'OctoPrint Status',
            subtitle: 'sldrprt.gcode'
        }
        ipcRenderer.send('notification', data)
    }

    static printFailed() {
        if (!Native.notificationsEnabled) return
    }

    static custom(arg) {
        if (!Native.notificationsEnabled) return
        ipcRenderer.send('notification', arg)
    }

    static disableHide() {
        ipcRenderer.send('disable-hide', true)
    }

    static enableHide() {
        ipcRenderer.send('disable-hide', false)
    }

    static openOcto() {
        ipcRenderer.send('open-in-browser', Api.url)
    }

    static quit() {
        ipcRenderer.send('quit')
    }
}
