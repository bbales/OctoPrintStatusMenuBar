Vue.component('ellipsis', {
    name: 'ellipsis',
    template: `<span>{{ellip}}</span>`,
    destroyed() { clearInterval(this.interval) },
    data: () => ({ state: 0, ellip: '', interval: false }),
    mounted() {
        this.interval = setInterval(() => {
            this.ellip = '.'.repeat(this.state)
            this.state = ++this.state > 3 ? 0 : this.state
        }, 300)
    },
})
