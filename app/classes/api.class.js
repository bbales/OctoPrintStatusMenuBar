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

    static problem() {
        app.loading = true
        app.problem = true
    }

    static getJob() {
        var jobRequest = new Request(this.url + 'api/job', { headers: this.headers, mode: 'cors' })
        return fetch(jobRequest)
            .then(r => r.json())
            .then(processJob)
            .catch(Api.problem)

        function processJob(j) {
            Vue.set(app, 'job', j.job)
            Vue.set(app, 'progress', j.progress)
            return app
        }
    }

    static getFiles(origin) {
        var filesRequest = new Request(this.url + 'api/files/' + origin + '?recursive=true', { headers: this.headers, mode: 'cors' })
        return fetch(filesRequest)
            .then(r => r.json())
            .then(processFiles)
            .catch(Api.problem)

        function processFiles(j) {
            return j.files.map(f => new PrinterFile(f, app))
        }
    }

    static getState() {
        var stateRequest = new Request(this.url + 'api/printer?exclude=temperature', { headers: this.headers, mode: 'cors' })
        return fetch(stateRequest)
            .then(r => r.json())
            .then(processState)
            .catch(Api.problem)

        function processState(j) {
            Vue.set(app, 'state', j.state)
            return app.state
        }
    }

    static sendJobCommand(command) {
        var commandRequest = new Request(this.url + 'api/job', { method: 'POST', headers: this.headers, mode: 'cors', body: JSON.stringify(command) })
        return fetch(commandRequest)
            .then(processCommandResponse)
            .then(() => window.wait(200).then(() => Api.getJob().then(() => Api.getState())))
            .catch(e => console.log(e))

        function processCommandResponse(j) {

        }
    }

    static toggleJob() {
        if (app.state.flags.printing) return Api.sendJobCommand({ command: 'pause', action: 'pause' })
        else return Api.sendJobCommand({ command: 'pause', action: 'resume' })
    }

    static stopJob() {
        return Api.sendJobCommand({ command: 'cancel' })
    }

    static printFile(file) {

    }

    static deleteFile(file) {

    }
}
