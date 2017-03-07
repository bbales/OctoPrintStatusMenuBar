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

function displayFiles(json) {
    data.files = json.files
    Vue.log(data.files)
}

Vue.log = (...o) => console.log(...(o.map(i => i === undefined ? undefined : JSON.parse(JSON.stringify(i)))))

let temp = JSON.parse('{"job":{"averagePrintTime":null,"estimatedPrintTime":null,"filament":null,"file":{"date":1488560639,"name":"slider_sidebar_front.gcode","origin":"local","path":"slider_sidebar_front.gcode","size":1084556},"lastPrintTime":null},"progress":{"completion":74.65506622064697,"filepos":809676,"printTime":5385,"printTimeLeft":1708,"printTimeLeftOrigin":"estimate"},"state":"Printing"}')
let files = JSON.parse('{"files":[{"name":"whistle_v2.gcode","path":"whistle_v2.gcode","type":"machinecode","typePath":["machinecode","gcode"],"hash":"...","size":1468987,"date":1378847754,"origin":"local","refs":{"resource":"http://example.com/api/files/local/whistle_v2.gcode","download":"http://example.com/downloads/files/local/whistle_v2.gcode"},"gcodeAnalysis":{"estimatedPrintTime":1188,"filament":{"length":810,"volume":5.36}},"print":{"failure":4,"success":23,"last":{"date":1387144346,"success":true}}},{"name":"whistle_.gco","path":"whistle_.gco","type":"machinecode","typePath":["machinecode","gcode"],"origin":"sdcard","refs":{"resource":"http://example.com/api/files/sdcard/whistle_.gco"}},{"name":"folderA","path":"folderA","type":"folder","typePath":["folder"],"children":[],"size":1334}],"free":"3.2GB"}')

displayJob(temp)
displayFiles(files)

function setPercent(a) {
    data.progress.filepos = a * data.job.file.size
}
