Vue.component('setup', {
    data: () => ({ apiKey: '', url: '' }),
    template: `
    <div class="setup">
        <div class="box no-right-border" style="width:100%; margin-bottom:10px;">Setup</div>

        <div class="ip">
            <div class="label">OctoPrint Address</div> <input type="text" v-model="url">
        </div>
        <div class="ip">
            <div class="label">API Key</div> <input type="password" v-model="apiKey">
        </div>
        <button @click="save()">Save</button>
    </div>
    `,
    mounted() {
        this.retrieve()
    },
    methods: {
        save() {
            localStorage.setItem('api-key', this.apiKey)
            localStorage.setItem('url', this.url)
        },
        retrieve() {
            this.url = localStorage.getItem('url')
            this.apiKey = localStorage.getItem('api-key')
        }
    }
})
