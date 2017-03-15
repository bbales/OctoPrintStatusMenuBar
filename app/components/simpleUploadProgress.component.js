Vue.component('simple-upload-progress', {
    data: () => ({ loaded: 0, total: 0.01, opacity: 0, text: '' }),
    template: `
    <span class="simple-upload-progress fade" :style="s">
        {{text ? '' : percent}}{{text}}
    </span>
    `,
    methods: {
        start(o) {
            this.opacity = 1
            this.text = ''
        },
        progress(o) {
            this.loaded = o.loaded
            this.total = o.total
        },
        end(o) {
            this.text = 'Complete!'
            window.wait(1000).then(() => this.opacity = 0)
        },
        timeout(o) {
            console.log('Upload Timeout')
        },
        err(o) {}
    },
    computed: {
        percent() { return (100 * this.loaded / this.total).toFixed(0) + '%' },
        s() { return { opacity: this.opacity } }
    }
})
