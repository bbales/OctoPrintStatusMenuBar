Vue.component('ellipsis', {
    name: 'ellipsis',
    template: `
    <span>{{ellip}}</span>
    `,
    data() {
        return {
            state: 0,
            ellip: '',
            interval: false
        }
    },
    destroyed() {
        clearInterval(this.interval)
    },
    mounted() {
        this.interval = setInterval(() => {
            this.ellip = '.'.repeat(this.state)
            this.state = ++this.state > 3 ? 0 : this.state
        }, 300)
    },
})
