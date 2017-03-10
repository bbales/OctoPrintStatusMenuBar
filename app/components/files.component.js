Vue.component('files', {
    template: `
    <div class="files" v-if="$root.view == 'files'">
        <div class="box no-right-border" style="width:100%;">Files <span @click="upDir()">Go Up dir</span> {{dir}}</div>
        <div class="box scroller no-right-border">
            <div class="box no-right-border light-bg" style="width:100%;" v-for="f in files" @click="fileClick(f)">
                <span style="margin-right:10px;">
                    <i v-if="f.isPrinting" title="Print in progress" class="fa fa-circle-o-notch fa-spin"></i>
                    <i v-if="f.isFolder" title="Folder" class="fa fa-folder"></i>
                    <i v-if="!f.isFolder && !f.isPrinting" class="fa fa-cube"></i>
                </span>
                {{f.name}}
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            dir: '',
            origin: 'local',
            files: []
        }
    },
    mounted() {
        Api.getFiles(this.origin, this.dir, this.$root).then(fl => this.files = fl)
    },
    methods: {
        fileClick(f) {
            if (f.isFolder) {
                this.files = []
                Api.getFiles(this.origin, this.dir + f.path + '/', this.$root).then(fl => {
                    this.dir += f.path + '/'
                    this.files = fl
                })
            }
        },
        upDir() {
            this.dir = this.dir.split('/').slice(0, -1).join('/')
        }
    }
})
