Vue.component('status', {
    template: `
    <div class="status no-select" v-show="$root.view == 'status'">
        <div class="box" style="width:31%; overflow:hidden">
            <span class="dark">Status:</span> {{state.text}}<ellipsis v-show="state.flags.printing"></ellipsis>
        </div>
        <div class="box" style="width:61%; overflow:hidden">
            <span class="dark">File Name:</span>
            <text-scroller :text="job.file.name ? job.file.name : 'No job in active'" :max="30"></text-scroller><br>
        </div>
        <div class="box no-right-border icon" style="width:8%" @click="openLink()">
            <img src="icon.png" style="cursor:pointer;" width="14" alt="">
        </div>
        <div class="box" style="width:65%;height:123px;">
            <div v-if="progress.completion">
                <span class="dark">Size:</span> {{job.file.size | filesize}}<br>
                <span class="dark">Date Uploaded:</span> {{job.file.date | moment1}}<br><br>
                <span class="dark">Time Remaining:</span> {{progress.printTimeLeft*1000 | duration-human}}<br>
                <span class="dark">Estimated Print Time:</span> {{progress.printTime*1000 | duration-human}}<br>
                <span class="dark">Job Completion:</span> {{jobCompletion}}
            </div>
            <div v-else>
                No job in active
            </div>
        </div>
        <div class="box no-right-border" style="width:35%">
            <progress-canvas :current="progress.filepos" :total="job.file.size"></progress-canvas>
        </div>
    </div>
    `,
    data() {
        return {
            job: this.$root.job,
            progress: this.$root.progress,
            state: this.$root.state
        }
    },
    mounted() {
        Vue.log(this.progress)
        let offset = Date.now()
        let start = this.progress.printTimeLeft
        this.countDown = setInterval(() => {
            this.progress.printTimeLeft = start - Math.ceil((Date.now() - offset) / 1000)
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
        progress() {
            console.log(this.progress)
            clearInterval(this.countDown)
            this.mounted()
        }
    },
    computed: {
        jobCompletion() {
            return (this.progress.filepos / 1024).toFixed(0) + '/' +
                (this.job.file.size / 1024).toFixed(0) +
                'KB(' + this.progress.completion.toFixed(2) + '%)'
        }
    }
})
