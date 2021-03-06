Vue.component('files', {
    template: `
    <div class="files no-select" v-show="$root.view == 'files'">
        <div class="box no-right-border" style="width:100%;">
            Files
            &nbsp;
            <i class="fa fa-refresh clickable-icon" title="Refresh" @click="refresh()"></i>
            &nbsp;
            <i class="fa fa-upload clickable-icon" title="Upload File" @click="chooseFile()"></i>
            &nbsp;
            <i class="fa fa-home clickable-icon" title="Go To Root" v-show="dir !== ''" @click="rootDir()"></i>
            &nbsp;
            <span class="dark">{{dir}}</span>
            <input type="file" ref="upload" v-show="false">
            <simple-upload-progress ref="progress"></simple-upload-progress>

            <span class="clickable-icon" style="float:right;">
                <span :class="origin !== 'local' ? 'dark' : ''" @click="origin = 'local'">
                    Local
                    <i class="fa fa-toggle-on green larger-icon" v-show="origin == 'sdcard'" title="Switch Local Files"></i>
                </span>
                <span :class="origin == 'local' ? 'dark' : ''" @click="origin = 'sdcard'">
                    <i class="fa fa-toggle-off green larger-icon" v-show="origin == 'local'" title="Switch to SD Card Files"></i>
                    SD Card
                </span>
            </span>
        </div>
        <div class="box scroller no-right-border">
            <div class="box no-right-border light-bg clickable-icon" style="width:100%;" v-if="dir !== ''" @click="upDir()">
                <i title="Move Up a Directory" class="fa fa-level-up" style="margin-left:5px;margin-right:10px;"></i>
                ../
            </div>
            <div class="box no-right-border light-bg" style="width:100%;" v-for="f in files" @click="fileClick(f)">
                <span style="margin-right:10px;">
                    <i v-if="f.isPrinting" title="Print in progress" class="fa fa-circle-o-notch fa-spin"></i>
                    <i v-if="f.isFolder" title="Folder" class="fa fa-folder"></i>
                    <i v-if="!f.isFolder && !f.isPrinting" class="fa fa-cube"></i>
                </span>
                <text-scroller :text="f.name" :max="50" :hover="true"></text-scroller>
                <span class="right">
                    <i v-if="!f.isPrinting" class="fa fa-trash clickable-icon" title="Delete file" @click.stop="deleteFile(f)"></i>
                    <i v-if="f.isGcode && !f.isPrinting && !$root.state.flags.printing" class="fa fa-print clickable-icon" title="Print This File" @click="$root.Api.printFile(f)"></i>
                </span>
            </div>
        </div>
    </div>
    `,
    data: () => ({
        dir: '',
        origin: 'local',
        rootFiles: []
    }),
    mounted() {
        this.refresh()
        this.$refs.upload.onchange = e => {
            var f = this.$refs.upload.files[0]
            Api.uploadFile(f, this.origin, this.$refs.progress)
                .then(() => {
                    this.refresh()
                    Native.enableHide()
                })
                .catch(() => {
                    console.log('problem uploading')
                    Native.enableHide()
                })
        }
    },
    methods: {
        fileClick(f) { if (f.isFolder) this.dir += '/' + f.name },
        upDir() { this.dir = this.dir.split('/').slice(0, -1).join('/') },
        refresh() { Api.getFiles(this.origin, this.$root).then(fl => this.rootFiles = fl) },
        rootDir() { this.dir = '' },
        deleteFile(f) { Api.deleteFile(f).then(() => this.refresh()) },
        chooseFile() {
            Native.disableHide()
            this.$refs.upload.click()
        }
    },
    watch: {
        origin(n, o) {
            if (n !== o) this.dir = ''
            this.refresh()
        }
    },
    computed: {
        files() {
            let files = this.rootFiles
            let path = this.dir.split('/').filter(f => f !== '')
            while (path.length) {
                files = files.find(f => f.isFolder && f.name == path[0]).children
                path = path.slice(1)
            }
            return files
        }
    }
})
