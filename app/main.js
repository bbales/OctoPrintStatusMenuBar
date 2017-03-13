var TEST = false

var ipcRenderer
try { ipcRenderer = require('electron').ipcRenderer } catch (e) { console.warn('Running outside of Electron environment') }

// Master list instance
const data = {
    Api: Api,
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

Api.getJob()
    .then(() => Api.getState())
    .then(() => {
        app.loading = false
        // setTimeout(() => Notification.printComplete(), 5000)
        setInterval(() => Api.getJob().then(() => Api.getState()).then(() => console.log('updated')), 10000)
    })
