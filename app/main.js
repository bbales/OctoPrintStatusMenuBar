var TEST = true

try { const { ipcRenderer } = require('electron') } catch (e) { console.warn('Running outside of Electron environment') }

// Master list instance
const data = {
    job: {},
    progress: {},
    state: {},
    view: 'status',
    loading: true,
    problem: false,
    tabs: [{
        name: 'status',
        label: 'Status',
        icon: 'fa-tasks'
    }, {
        name: 'files',
        label: 'Files',
        icon: 'fa-file'
    }, {
        name: 'setup',
        label: '',
        icon: 'fa-cog'
    }]
}

// Instantiate
const app = new Vue({ data, el: '#app' })

Api.getJob(app).then(() => Api.getState(app).then(() => {
    app.loading = false
    Notification.printComplete()
}))
