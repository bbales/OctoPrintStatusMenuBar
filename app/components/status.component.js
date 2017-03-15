Vue.component('status', {
    template: `
    <div class="status no-select" v-show="$root.view == 'status'">
        <div class="box" style="width:31%; overflow:hidden;white-space:nowrap">
            <span class="dark">Status:</span>
            <text-scroller :text="$root.state.text ? $root.state.text : 'No Connection'" :max="12"></text-scroller>
            <ellipsis v-show="$root.state.flags && $root.state.flags.printing"></ellipsis>
        </div>
        <div class="box" style="width:61%; overflow:hidden;white-space:nowrap">
            <span class="dark">File Name:</span>
            <text-scroller :text="$root.job.file && $root.job.file.name ? $root.job.file.name : 'No job in progress.'" :max="30"></text-scroller><br>
        </div>
        <div class="box no-right-border icon" style="width:8%" @click="openLink()">
            <img src="icon.png" style="cursor:pointer;" width="14" alt="">
        </div>
        <div class="box" style="width:65%;height:123px;">
            <div v-if="$root.progress.completion !== null">
                <span class="dark">Size:</span> {{$root.job.file.size | filesize}}<br>
                <span class="dark">Date Uploaded:</span> {{$root.job.file.date | moment1}}<br><br>
                <div v-show="$root.progress.printTimeLeft !== null">
                    <span class="dark">Time Remaining:</span> {{$root.progress.printTimeLeft*1000 | duration-human}}<br>
                    <span class="dark">Current Print Time:</span> {{$root.progress.printTime*1000 | duration-human}}<br>
                    <span class="dark">Estimated Print Time:</span> {{$root.job.estimatedPrintTime*1000 | duration-human}}<br>
                    <span class="dark">Job Completion:</span> {{jobCompletion}}
                </div>
            </div>
            <div v-else>No job in progress.</div>
        </div>
        <div class="box no-right-border" style="width:35%" v-show="$root.job.file">
            <progress-canvas :current="$root.progress.filepos" :total="$root.job.file.size"></progress-canvas>
        </div>
    </div>
    `,
    mounted() {
        let offset = Date.now()
        let start = this.$root.progress.printTimeLeft
        this.countDown = setInterval(() => {
            if (this.$root.state.text == 'Printing')
                this.$root.progress.printTimeLeft = start - Math.ceil((Date.now() - offset) / 1000)
        }, 1200)
    },
    destroyed() {
        clearInterval(this.countDown)
    },
    methods: {
        openLink() {
            ipcRenderer.send('open-in-browser', Api.url)
        }
    },
    watch: {
        'progress.printTime' () {
            clearInterval(this.countDown)
            this.mounted()
        }
    },
    computed: {
        jobCompletion() {
            return (this.$root.progress.filepos / 1024).toFixed(0) + '/' +
                (this.$root.job.file.size / 1024).toFixed(0) +
                'KB (' + this.$root.progress.completion.toFixed(2) + '%)'
        }
    }
})
