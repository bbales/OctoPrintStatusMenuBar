Vue.component('progress-canvas', {
    template: `
    <div class="progress-canvas">
        <canvas ref="can" :width="width+2" :height="height+2"></canvas>
    </div>
    `,
    props: ['current', 'total'],
    data: () => ({ height: 100, width: 50, subSize: 5, flashing: false }),
    computed: {
        subs() { return { x: Math.floor((this.width - 1) / this.subSize), y: Math.floor((this.height - 1) / this.subSize) } },
        completion() { return this.current / this.total }
    },
    mounted() {
        // Set up the canvas
        this.ctx = this.$refs.can.getContext('2d')

        // Flip and translate
        this.ctx.rotate(Math.PI)
        this.ctx.translate(-this.width - 1, -this.height - 1)

        // Animate to the current progress
        this.setProgress(true).then(() => console.log('done'))
    },
    watch: {
        current() {
            // Clear the last flashing animation
            this.flashing = false

            // Go to the current progress
            window.requestAnimationFrame(() => this.setProgress())
        }
    },
    methods: {
        clearCanvas() { this.ctx.clearRect(0, 0, this.width, this.height) },
        clearCell(x, y) { this.ctx.clearRect(x * this.subSize + 1, y * this.subSize + 1, this.subSize - 1, this.subSize - 1) },
        drawGrid() {
            this.ctx.fillStyle = "black"
            for (let i = 0; i < this.width + 1; i += this.subSize) this.ctx.fillRect(Math.floor(i), 0, 1, this.height)
            for (let i = 0; i < this.height + 1; i += this.subSize) this.ctx.fillRect(0, Math.floor(i), this.width, 1)
        },
        fillCell(x, y, percent = 0.5) {
            this.ctx.fillStyle = shadeBlend(percent, '#5a1bd1', '#1bd12d')
            this.ctx.fillRect(x * this.subSize + 1, y * this.subSize + 1, this.subSize - 1, this.subSize - 1)
        },
        setProgress(animate = false) {
            this.clearCanvas()
            this.drawGrid()
            return new Promise((res, rej) => {
                // Current cursor position
                var cur = {
                    x: 0,
                    y: 0,
                    total: () => (cur.y - 1) * this.subs.x - 1 + (cur.y % 2 ? this.subs.x - cur.x : cur.x),
                    max: Math.floor(this.subs.x * this.subs.y * this.completion)
                }

                // Flash length in ms
                var flashLength = 400

                // Recursive flashing function
                var flashCell = (s = -1) => {
                    // Set flashing flag on initialize
                    if (s < 0) this.flashing = true

                    // Fill cell for flash length
                    if (s > (flashLength / 1000) * 60) this.fillCell(cur.x, cur.y, 1)

                    // Clear cell for flash length
                    else this.clearCell(cur.x, cur.y)

                    // Increment or reset flash counter
                    s = s > (flashLength / 1000) * 60 * 2 ? 0 : s + 1

                    // If flashing isnt disabled, recursively call this function
                    if (this.flashing) window.requestAnimationFrame(() => flashCell(s))
                }

                // Recursive cell painting function
                var fillCells = () => {
                    // Fill the current cell
                    this.fillCell(cur.x, cur.y, cur.total() / cur.max)

                    // Move cursor to new cell
                    if ((cur.y % 2 && cur.x == 0) || (!(cur.y % 2) && cur.x == this.subs.x)) cur.y++;
                    else if (cur.y % 2 && cur.x > 0) cur.x--;
                    else if (!(cur.y % 2) && cur.x < this.subs.x) cur.x++;

                    // Recursively call this function
                    if (cur.total() < cur.max) animate /*&& cur.x % 2*/ ? window.requestAnimationFrame(fillCells) : fillCells()

                    // Flash last cell async and resolve promise
                    else new Promise(() => flashCell()) && res()
                }
                fillCells()
            })
        }
    }
})
