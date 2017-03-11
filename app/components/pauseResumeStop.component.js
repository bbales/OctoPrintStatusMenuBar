Vue.component('pause-resume-stop', {
    template: `
    <div class="pause-resume-stop no-select right">
        <div class="tab left-border" v-show="showPlay" title="Pause Job" @click="toggleJob()"><i class="fa fa-play"></i></div>
        <div class="tab left-border" v-show="showPause" title="Resume Job" @click="toggleJob()"><i class="fa fa-pause"></i></div>
        <div class="tab" title="Stop Job"><i class="fa fa-stop"></i></div>
    </div>
    `,
    computed: {
        showPlay() {
            return this.$root.state.text !== 'Printing'
        },
        showPause() {
            return this.$root.state.text == 'Printing'
        }
    },
    mounted() {

    },
    watch: {

    },
    methods: {

        toggleJob() {
            Api.sendJobCommand(command)
                .then(r => {})
                .catch(e => {})
        }
    }
})
