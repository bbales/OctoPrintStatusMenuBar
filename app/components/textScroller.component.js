Vue.component('text-scroller', {
    name: 'text-scroller',
    template: `
    <span :title="text">{{fragment}}</span>
    `,
    props: { text: String, max: Number },
    data() {
        return {
            pos: 0,
            interval: false,
            numSpaces: 5,
        }
    },
    destroyed() {
        clearInterval(this.interval)
    },
    mounted() { this.start() },
    methods: {
        start() {
            if (this.text.length < this.max) return
            clearInterval(this.interval)
            this.interval = setInterval(() => {
                this.pos = (this.pos > this.text.length + this.numSpaces - 2) ? 0 : this.pos + 1
            }, 150)
        }
    },
    watch: {
        text() { this.start() }
    },
    computed: {
        fragment() {
            return (this.text + (' '.repeat(this.numSpaces)) + this.text).slice(this.pos, this.pos + this.max).replace(/ /g, '\u00a0')
        }
    }
})
