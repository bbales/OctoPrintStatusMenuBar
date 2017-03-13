Vue.component('text-scroller', {
    name: 'text-scroller',
    template: `<span :title="text">{{text.length < max ? text : fragment}}</span>`,
    props: { text: String, max: Number },
    mounted() { this.start() },
    destroyed() { clearInterval(this.interval) },
    data: () => ({ pos: 0, interval: false, spaces: 5 }),
    methods: {
        start() {
            clearInterval(this.interval)
            this.interval = setInterval(() => this.pos = (this.pos > this.text.length + this.spaces - 2) ? 0 : this.pos + 1, 150)
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
