Vue.component('setup', {
    data: () => ({ apiKey: '', url: '' }),
    template: `
    <div class="setup" v-if="$root.view == 'setup'">
        <div class="box no-right-border" style="width:100%; margin-bottom:10px;">Setup</div>

        <div class="ip">
            <div class="label">OctoPrint Address</div> <input type="text" v-model="url">
        </div>

        <div class="ip">
            <div class="label">API Key</div> <input type="password" v-model="apiKey">
        </div>

        <button @click="save()">Save</button>
        <button @click="quit()">Quit</button>
    </div>
    `,
    mounted() {
        this.retrieve()
    },
    methods: {
        save() {
            Api.apiKey = this.apiKey
            Api.url = this.url
        },
        retrieve() {
            this.url = Api.url
            this.apiKey = Api.apiKey
        },
        quit() {
            const { ipcRenderer } = require('electron')
            ipcRenderer.send('quit')
        }
    }
})
