Vue.component('setup', {
    data: () => ({ apiKey: '', url: '', notifications: false }),
    template: `
    <div class="setup" v-if="$root.view == 'setup'">
        <div class="box no-right-border" style="width:100%; margin-bottom:10px;">Setup</div>

        <div class="ip">
            <div class="label">OctoPrint Address</div> <input type="text" v-model="url">
        </div>

        <div class="ip">
            <div class="label">API Key</div> <input type="password" v-model="apiKey">
        </div>

        <div class="ip">
            <div class="label">Enable Notifications</div> <input type="checkbox" v-model="notificationsEnabled">
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
            // Save API key
            Api.apiKey = this.apiKey

            // Add a forward slash to the url if one is not present
            if (this.url[this.url.length - 1] !== '/') this.url += '/'
            Api.url = this.url

            // Save notifications setting
            Native.notificationsEnabled = !!this.notificationsEnabled
        },
        retrieve() {
            this.url = Api.url
            this.apiKey = Api.apiKey
            this.notificationsEnabled = Native.notificationsEnabled
        },
        quit() {
            Native.quit()
        }
    }
})
