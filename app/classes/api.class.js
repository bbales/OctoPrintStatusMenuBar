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

    static problem() {
        app.loading = true
        app.problem = true
    }

    static getJob() {
        let jobRequest = new Request(`${this.url}api/job`, this.headers)
        return fetch(jobRequest)
            .then(r => r.json())
            .then(processJob)
            .catch(Api.problem)

        function processJob(j) {
            app.job = j.job
            app.progress = j.progress
        }
    }

    static getFiles(origin) {
        let filesRequest = new Request(`${this.url}api/files/${origin}?recursive=true`, this.headers)
        return fetch(filesRequest)
            .then(r => r.json())
            .then(processFiles)
            .catch(Api.problem)

        function processFiles(j) {
            return j.files.map(f => new PrinterFile(f))
        }
    }

    static getState() {
        let stateRequest = new Request(`${this.url}api/printer?exclude=temperature`, this.headers)
        return fetch(stateRequest)
            .then(r => r.json())
            .then(processState)
            .catch(Api.problem)

        function processState(j) {
            // Vue.set(app, 'state', j.state)
            app.state = j.state
        }
    }

    static sendJobCommand(command) {
        let commandRequest = new Request(`${this.url}api/job`, Object.assign({}, this.headers, { method: 'POST', body: JSON.stringify(command) }))
        return fetch(commandRequest)
            .then(() => window.wait(200).then(() => Api.getJob().then(() => Api.getState())))
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
            .then(() => window.wait(200).then(() => Api.getJob().then(() => Api.getState())))
    }

    static deleteFile(file) {
        let deleteFileRequest = new Request(`${this.url}api/files/${file.origin}/${file.path}`, Object.assign({}, this.headers, { method: 'DELETE' }))

        return fetch(deleteFileRequest)
    }

    static uploadFile(file, origin = 'local') {
        var headers = new Headers()
        headers.append('X-Api-Key', this.apiKey)
        headers.append('Content-Type', 'multipart/form-data')

        var reader = new FileReader()

        reader.onload = e => {
            var options = { headers, mode: 'cors', method: 'POST', body: e.currentTarget.result }
            var uploadFileRequest = new Request(`${this.url}api/files/${origin}`, options)
            fetch(uploadFileRequest)
                .then(r => r.json())
                .then(r => console.log('success', r))
            // .catch(err => console.log('Request failed', err))

        }

        reader.readAsText(file)


        return
    }
}


function(url, file) {
    var fileData = file;

    var filesize = fileData.size

    var form = new FormData()
    form.append("file", fileData, fileData.name)

    var deferred = $.Deferred()

    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            console.log({ loaded: filesize, total: filesize })

            var success = request.status >= 200 && request.status < 300 || request.status === 304
            var error, json, statusText

            try {
                json = JSON.parse(request.response)
                statusText = "success"
            } catch (e) {
                success = false
                error = e
                statusText = "parsererror"
            }

            if (success) {
                console.log('success', [json, statusText, request])
            } else {
                if (!statusText) statusText = request.statusText;
                console.log('error', [request, statusText, error])
            }
        }
    }

    request.ontimeout = function() {
        deferred.reject([request, "timeout", "Timeout"]);
    }
    request.upload.addEventListener("loadstart", function(e) {
        deferred.notify({ loaded: e.loaded, total: e.total });
    })
    request.upload.addEventListener("progress", function(e) {
        deferred.notify({ loaded: e.loaded, total: e.total });
    })
    request.upload.addEventListener("loadend", function(e) {
        deferred.notify({ loaded: e.loaded, total: e.total });
    })

    var headers = OctoPrint.getRequestHeaders();

    var urlToCall = url;
    if (!_.startsWith(url, "http://") && !_.startsWith(url, "https://")) {
        urlToCall = OctoPrint.getBaseUrl() + url;
    }

    request.open("POST", urlToCall);
    _.each(headers, function(value, key) {
        request.setRequestHeader(key, value);
    });
    request.send(form);

    return deferred.promise();
}
