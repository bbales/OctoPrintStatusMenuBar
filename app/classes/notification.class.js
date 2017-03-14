class Notification {
    static set notificationsEnabled(v) { localStorage.setItem('notifications-enabled', v) }
    static get notificationsEnabled() { return localStorage.getItem('notifications-enabled') }

    static printComplete() {
        if (!Notification.notificationsEnabled) return
        let data = {
            message: 'Job Complete',
            title: 'OctoPrint Status',
            subtitle: 'sldrprt.gcode'
        }
        ipcRenderer.send('notification', data)
    }

    static printFailed() {
        if (!Notification.notificationsEnabled) return
    }

    static custom(arg) {
        if (!Notification.notificationsEnabled) return
        ipcRenderer.send('notification', arg)
    }
}
