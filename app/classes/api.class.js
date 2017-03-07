class Api {
    static get apiKey() {
        return localStorage.getItem('api-key')
    }

    static get url() {
        return localStorage.getItem('url')
    }

    static get headers() {
        var headers = new Headers()
        headers.append('X-Api-Key', this.apiKey)
        headers.append('Content-Type', 'application/json')
        return headers
    }

    static getJob() {
        var jobRequest = new Request(this.url + 'api/job', { headers: this.headers, mode: 'cors' })
        return fetch(jobRequest).then(r => r.json())
    }

    static getFiles() {
        var jobRequest = new Request(this.url + 'api/files', { headers: this.headers, mode: 'cors' })
        return fetch(jobRequest).then(r => r.json())
    }
}
