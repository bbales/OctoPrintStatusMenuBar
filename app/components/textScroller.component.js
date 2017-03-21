Vue.component('text-scroller', {
    name: 'text-scroller',
    template: `<span :title="text" @mouseover="start()" @mouseleave="stop()">{{text.length < max ? text : fragment}}</span>`,
    props: { text: String, max: Number, hover: Boolean },
    mounted() { if (!this.hover) this.start() },
    destroyed() { clearInterval(this.interval) },
    data: () => ({ pos: 0, interval: false, spaces: 5 }),
    methods: {
        start() {
            clearInterval(this.interval)
            this.interval = setInterval(() => this.pos = (this.pos > this.text.length + this.spaces - 2) ? 0 : this.pos + 1, 150)
        },
        stop() {
            if (this.hover) {
                clearInterval(this.interval)
                this.pos = 0
            }
        }
    },
    watch: {
        text() { this.start() }
    },
    computed: {
        fragment() {
            return (this.text + ' '.repeat(this.spaces) + this.text).slice(this.pos, this.pos + this.max).replace(/ /g, '\u00a0')
        }
    }
})
