Vue.component('status', {
    template: `
    <div class="status no-select" v-show="$root.view == 'status'">
        <div class="box" style="width:30%">
            <span class="dark">Status:</span> {{state.text}}<ellipsis v-show="state.flags.printing"></ellipsis>
        </div>
        <div class="box" style="width:62%">
            <span class="dark">File Name:</span> {{job.file.name}}<br>
        </div>
        <div class="box no-right-border icon" style="width:8%" @click="openLink()">
            <img src="icon.png" style="cursor:pointer;" width="14" alt="">
        </div>
        <div class="box" style="width:65%;height:123px;">
            <span class="dark">Size:</span> {{job.file.size | filesize}}<br>
            <span class="dark">Date Uploaded:</span> {{job.file.date | moment1}}<br><br>
            <span class="dark">Time Remaining:</span> {{progress.printTimeLeft*1000 | duration-human}}<br>
            <span class="dark">Estimated Print Time:</span> {{progress.printTime*1000 | duration-human}}<br>
            <span class="dark">Job Completion:</span> {{(progress.filepos/1024).toFixed(0)}}/{{(job.file.size/1024).toFixed(0)}}KB ({{progress.completion.toFixed(2)}}%)
        </div>
        <div class="box no-right-border" style="width:35%">
            <progress-canvas :current="progress.filepos" :total="job.file.size"></progress-canvas>
            <!-- <progress-canvas :current="job.file.size" :total="job.file.size"></progress-canvas> -->
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
            openInBrowser(Api.url)
        }
    }
})
