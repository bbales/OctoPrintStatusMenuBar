Vue.component('pause-resume-stop', {
    template: `
    <div class="pause-resume-stop no-select right">
        <div class="tab left-border" v-show="showPlay" title="Pause Job" @click="$root.Api.toggleJob"><i class="fa fa-play"></i></div>
        <div class="tab left-border" v-show="showPause" title="Resume Job" @click="$root.Api.toggleJob"><i class="fa fa-pause"></i></div>
        <div class="tab" title="Cancel Job" v-show="showStop" @click="$root.Api.stopJob"><i class="fa fa-stop"></i></div>
    </div>
    `,
    computed: {
        showPlay() {
            return this.$root.state.flags && this.$root.state.flags.paused
        },
        showPause() {
            return this.$root.state.flags && this.$root.state.flags.printing
        },
        showStop() {
            return this.$root.state.flags && (this.$root.state.flags.printing || this.$root.state.flags.paused)
        },
    }
})
