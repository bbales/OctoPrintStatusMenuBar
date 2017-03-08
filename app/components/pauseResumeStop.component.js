Vue.component('pause-resume-stop', {
    template: `
    <div class="pause-resume-stop">
        <div class="play-button" v-show="showPlay" title="Pause Job"><i class="fa fa-play"></i></div>
        <div class="pause-button" v-show="showPause" title="Resume Job"><i class="fa fa-pause"></i></div>
        <div class="stop-button" title="Stop Job"><i class="fa fa-stop"></i></div>
    </div>
    `,
    props: ['state'],
    data: () => ({}),
    computed: {
        showPlay() {
            return this.state !== 'Printing'
        },
        showPause() {
            return this.state == 'Printing'
        }
    },
    mounted() {

    },
    watch: {

    },
    methods: {

    }
})
