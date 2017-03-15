try { var ipcRenderer = require('electron').ipcRenderer } catch (e) { console.warn('Running outside of Electron environment') }

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

// Start polling
Api.getJob()
    .then(() => Api.getState())
    .then(() => {
        app.loading = false
        setInterval(() => {
            app.loading = false
            app.problem = false
            Api.getJob().then(() => Api.getState()).then(() => Vue.log(data))
        }, data.problem ? 1000 : 5000)
    })
