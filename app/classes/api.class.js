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

    static getJob(data = app) {
        var jobRequest = new Request(this.url + 'api/job', { headers: this.headers, mode: 'cors' })
        return fetch(jobRequest)
            .then(r => r.json())
            .then(processJob)
            .catch(e => {
                data.loading = true
                data.problem = true
            })

        function processJob(j) {
            data.job = j.job
            data.progress = j.progress
            return data
        }
    }

    static getFiles(origin, data = app) {
        var filesRequest = new Request(this.url + 'api/files/' + origin + '?recursive=true', { headers: this.headers, mode: 'cors' })
        return fetch(filesRequest)
            .then(r => r.json())
            .then(processFiles)
            .catch(e => {
                data.loading = true
                data.problem = true
            })

        function processFiles(j) {
            return j.files.map(f => new PrinterFile(f, data))
        }
    }

    static getState(data = app) {
        var stateRequest = new Request(this.url + 'api/printer?exclude=temperature', { headers: this.headers, mode: 'cors' })
        return fetch(stateRequest)
            .then(r => r.json())
            .then(processState)
            .catch(e => {
                data.loading = true
                data.problem = true
            })

        function processState(j) {
            data.state = j.state
            return j.state
        }
    }

    static sendJobCommand(command) {
        var commandRequest = new Request(this.url + 'api/command/pause', { headers: this.headers, mode: 'cors' })
        return fetch(commandRequest)
            .then(r => r.json())
            .then(processCommandResponse)

        function processCommandResponse(j) {

        }
    }

    static toggleJob() {

    }

    static stopJob() {

    }

    static printFile(file) {

    }

    static deleteFile(file) {

    }
}
