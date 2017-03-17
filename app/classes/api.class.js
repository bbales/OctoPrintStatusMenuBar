class Api {
    static get apiKey() { return localStorage.getItem('api-key') }
    static set apiKey(v) { localStorage.setItem('api-key', v) }

    static get url() { return localStorage.getItem('url') }
    static set url(v) { localStorage.setItem('url', v) }

    static get headers() {
        var headers = new Headers()
        headers.append('X-Api-Key', this.apiKey)
        headers.append('Content-Type', 'application/json')
        return { headers, mode: 'cors' }
    }

    static poll() {
        Api.getJob()
            .then(() => Api.getState())
            .then(() => {
                app.loading = false
                app.problem = false
                app.$emit('polled')
                return Wait(1000).then(Api.poll)
            })
            .catch(e => {
                if (e.toString() == 'TypeError: Failed to fetch') app.problemText = 'OctoPrint not responding.'
                app.loading = true
                app.problem = true
                app.$emit('polled')
                return Wait(600).then(Api.poll)
            })
    }

    static getJob() {
        let jobRequest = new Request(`${this.url}api/job`, this.headers)
        return fetch(jobRequest)
            .json()
            .then(processJob)

        function processJob(j) {
            app.job = j.job
            app.progress = j.progress
        }
    }

    static getFiles(origin) {
        let filesRequest = new Request(`${this.url}api/files/${origin}?recursive=true`, this.headers)
        return fetch(filesRequest).json()
            .then(processFiles)

        function processFiles(j) {
            return j.files.map(f => new PrinterFile(f))
        }
    }

    static getState() {
        let stateRequest = new Request(`${this.url}api/printer`, this.headers)
        return fetch(stateRequest).json()
            .then(processState)

        function processState(j) {
            app.state = j.state

            // Push new temp into history
            let newTemp = Object.assign(j.temperature, { ts: Math.round(Date.now() / 1000) })
            app.temperature.push(newTemp)

            // Only keep the last 10 minutes
            app.temperature.filter(t => newTemp.ts - t.ts < 300)
        }
    }

    static sendJobCommand(command) {
        let commandRequest = new Request(`${this.url}api/job`, Object.assign({}, this.headers, { method: 'POST', body: JSON.stringify(command) }))
        return fetch(commandRequest)
            .then(() => Wait(200).then(() => Api.getJob().then(() => Api.getState())))
    }

    static toggleJob() {
        return Api.sendJobCommand({ command: 'pause', action: (app.state.flags.printing ? 'pause' : 'resume') })
    }

    static stopJob() {
        return Api.sendJobCommand({ command: 'cancel' })
    }

    static printFile(file) {
        let body = JSON.stringify({ command: 'select', print: true })

        let printFileRequest = new Request(`${this.url}api/files/${file.origin}/${file.path}`, Object.assign({}, this.headers, { method: 'POST', body }))

        return fetch(printFileRequest)
            .then(() => Wait(200).then(() => Api.getJob().then(() => Api.getState())))
    }

    static deleteFile(file) {
        let deleteFileRequest = new Request(`${this.url}api/files/${file.origin}/${file.path}`, Object.assign({}, this.headers, { method: 'DELETE' }))

        return fetch(deleteFileRequest)
    }

    static uploadFile(file, origin = 'local', loader = false) {
        return new Promise((res, rej) => {
            // File upload form data
            var form = new FormData()
            form.append('file', file, file.name)

            var r = new XMLHttpRequest()

            r.onreadystatechange = () => {
                if (r.readyState == 4) {
                    console.log({ loaded: file.size, total: file.size })

                    var error, json, statusText

                    try {
                        json = JSON.parse(r.response)
                        statusText = 'success'
                    } catch (e) {
                        success = false
                        error = e
                        statusText = 'parsererror'
                    }

                    let success = r.status >= 200 && r.status < 300 || r.status === 304
                    if (success) return res([json, statusText, r])
                    return rej([r, statusText ? statusText : r.statusText, error])
                }
            }

            // Loader events
            if (loader) {
                r.ontimeout = () => loader.timeout([r, 'timeout', 'Timeout'])
                r.upload.addEventListener('loadstart', e => loader.start({ loaded: e.loaded, total: e.total }))
                r.upload.addEventListener('progress', e => loader.progress({ loaded: e.loaded, total: e.total }))
                r.upload.addEventListener('loadend', e => loader.end({ loaded: e.loaded, total: e.total }))
            }

            // Dispatch request
            r.open('POST', `${this.url}api/files/${origin}`)
            r.setRequestHeader('X-Api-Key', this.apiKey)
            r.send(form)
        })
    }
}
