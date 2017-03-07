// Master list instance
const data = {
    job: {},
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

// Config
let api = '691C752E8FFA4DF2B5B988FB9385B56A'
let url = 'http://octopi.local/'

var headers = new Headers()
headers.append("X-Api-Key", api)
headers.append("Content-Type", 'application/json')

var jobRequest = new Request(url + 'api/job', { headers, mode: 'cors' })

// fetch(jobRequest)
//     .then(r => r.json())
//     .then(json => displayJob(json))
//     .catch(e => data.problem = true)

function displayJob(json) {
    data.loading = false
    data.problem = false
    data.job = json.job
    data.status = json.state
    data.progress = json.progress
    Vue.log(json)
}

Vue.log = (...o) => console.log(...(o.map(i => i === undefined ? undefined : JSON.parse(JSON.stringify(i)))))

let temp = JSON.parse('{"job":{"averagePrintTime":null,"estimatedPrintTime":null,"filament":null,"file":{"date":1488560639,"name":"slider_sidebar_front.gcode","origin":"local","path":"slider_sidebar_front.gcode","size":1084556},"lastPrintTime":null},"progress":{"completion":74.65506622064697,"filepos":809676,"printTime":5385,"printTimeLeft":1708,"printTimeLeftOrigin":"estimate"},"state":"Printing"}')

displayJob(temp)

function setPercent(a) {
    data.progress.filepos = a * data.job.file.size
}
