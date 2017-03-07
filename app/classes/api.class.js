class Api {
    static get apiKey() {
        return localStorage.getItem('api-key')
    }

    static set apiKey(v) {
        localStorage.setItem('api-key', v)
    }

    static get url() {
        return localStorage.getItem('url')
    }

    static set url(v) {
        localStorage.setItem('url', v)
    }

    static get headers() {
        var headers = new Headers()
        headers.append('X-Api-Key', this.apiKey)
        headers.append('Content-Type', 'application/json')
        return headers
    }

    static getJob() {
        var jobRequest = new Request(this.url + '/api/job', { headers: this.headers, mode: 'cors' })
        return fetch(jobRequest).then(r => r.json())
    }

    static getFiles() {
        var filesRequest = new Request(this.url + '/api/files', { headers: this.headers, mode: 'cors' })
        return fetch(filesRequest).then(r => r.json())
    }
}
