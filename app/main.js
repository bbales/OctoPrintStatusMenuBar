var TEST = true

// Master list instance
const data = {
    job: {},
    files: [],
    progress: {},
    status: '',
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
    }, ]
}

// Instantiate
const app = new Vue({ data, el: '#app' })

Api.getJob(app).then(() => {
    app.loading = false
    console.log('got the job!')
})

function setPercent(a) {
    data.progress.filepos = a * data.job.file.size
}

function openInBrowser(url) {
    const { ipcRenderer } = require('electron')
    ipcRenderer.send('open-in-browser', url)
}
