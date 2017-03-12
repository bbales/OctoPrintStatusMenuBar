class Api {
    static get apiKey() { return localStorage.getItem('api-key') }
    static set apiKey(v) { localStorage.setItem('api-key', v) }

    static get url() { return localStorage.getItem('url') }
    static set url(v) { localStorage.setItem('url', v) }

    static get headers() {
        var headers = new Headers()
        headers.append('X-Api-Key', this.apiKey)
        headers.append('Content-Type', 'application/json')
        return headers
    }

    static getJob(data) {
        if (TEST) {
            let job = JSON.parse('{"job":{"averagePrintTime":null,"estimatedPrintTime":null,"filament":null,"file":{"date":1488560639,"name":"slider_sidebar_front.gcode","origin":"local","path":"slider_sidebar_front.gcode","size":1084556},"lastPrintTime":null},"progress":{"completion":74.65506622064697,"filepos":809676,"printTime":5385,"printTimeLeft":1708,"printTimeLeftOrigin":"estimate"},"state":"Printing"}')
            return new Promise(res => res(job)).then(processJob)
        }

        var jobRequest = new Request(this.url + '/api/job', { headers: this.headers, mode: 'cors' })
        return fetch(jobRequest)
            .then(r => r.json())
            .then(processJob)

        function processJob(j) {
            data.job = j.job
            data.progress = j.progress
            return data
        }
    }

    static getFiles(origin, data) {
        if (TEST) {
            let files = JSON.parse('{"files":[{"name":"slider_sidebar_front.gcode","path":"slider_sidebar_front.gcode","type":"machinecode","typePath":["machinecode","gcode"],"hash":"...","size":1468987,"date":1378847754,"origin":"local","refs":{"resource":"http://example.com/api/files/local/whistle_v2.gcode","download":"http://example.com/downloads/files/local/whistle_v2.gcode"},"gcodeAnalysis":{"estimatedPrintTime":1188,"filament":{"length":810,"volume":5.36}},"print":{"failure":4,"success":23,"last":{"date":1387144346,"success":true}}},{"name":"whistle_.gco","path":"whistle_.gco","type":"machinecode","typePath":["machinecode","gcode"],"origin":"sdcard","refs":{"resource":"http://example.com/api/files/sdcard/whistle_.gco"}},{"name":"folderA","path":"folderA","type":"folder","typePath":["folder"],"children":[{"name":"test.gcode","path":"folderA/test.gcode","type":"machinecode","typePath":["machinecode","gcode"],"hash":"...","size":1234,"date":1378847754,"origin":"local","refs":{"resource":"http://example.com/api/files/local/folderA/test.gcode","download":"http://example.com/downloads/files/local/folderA/test.gcode"}},{"name":"subfolder","path":"folderA/subfolder","type":"folder","typePath":["folder"],"children":[{"name":"test.gcode","path":"folderA/subfolder/test2.gcode","type":"machinecode","typePath":["machinecode","gcode"],"hash":"...","size":100,"date":1378847754,"origin":"local","refs":{"resource":"http://example.com/api/files/local/folderA/subfolder/test2.gcode","download":"http://example.com/downloads/files/local/folderA/subfolder/test2.gcode"}}],"size":100,"refs":{"resource":"http://example.com/api/files/local/folderA/subfolder"}}],"size":1334,"refs":{"resource":"http://example.com/api/files/local/folderA"}}],"free":"3.2GB"}')
            return new Promise(res => res(files)).then(processFiles)
        }

        var filesRequest = new Request(this.url + '/api/files/' + origin + '?recursive=true', { headers: this.headers, mode: 'cors' })
        return fetch(filesRequest)
            .then(r => r.json())
            .then(processFiles)

        function processFiles(j) {
            return j.files.map(f => new PrinterFile(f, data))
        }
    }

    static getState(data) {
        if (TEST) {
            let state = JSON.parse('{"state":{"text":"Printing","flags":{"operational":true,"paused":false,"printing":true,"sdReady":true,"error":false,"ready":false,"closedOrError":false}}}')
            return window.wait(1000 * Math.random()).then(v => new Promise(res => res(state)).then(processState))
        }

        function processState(j) {
            data.state = j.state
            return j.state
        }
    }

    static sendJobCommand(command) {
        var commandRequest = new Request(this.url + '/api/command/pause', { headers: this.headers, mode: 'cors' })
        return fetch(commandRequest)
            .then(r => r.json())
            .then(processCommandResponse)

        function processCommandResponse(json) {

        }
    }

    static printFile(file) {

    }

    static deleteFile(file) {

    }
}
