Vue.component('progress-canvas', {
    template: `
    <div class="progress-canvas">
        <canvas ref="can" :width="width+45+2" :height="height+2"></canvas>
    </div>
    `,
    props: ['current', 'total'],
    data: () => ({ height: 100, width: 70, subSize: 5, flashing: false }),
    computed: {
        subs() { return { x: Math.floor((this.width - 1) / this.subSize), y: 1 + Math.floor((this.height - 1) / this.subSize) } },
        completion() { return this.current / this.total }
    },
    mounted() {
        // Set up the canvas
        this.ctx = this.$refs.can.getContext('2d')

        // Flip and translate
        this.ctx.rotate(Math.PI)
        this.ctx.translate(-this.width - 1, -this.height - 1)

        // Animate to the current progress
        this.setProgress(true)
    },
    destroyed() { this.flashing = false },
    watch: {
        current(n, o) {
            // Clear the last flashing animation
            this.flashing = false

            // Go to the current progress
            window.requestAnimationFrame(() => this.setProgress())

            if (this.completion >= 1) Notification.printComplete()
        }
    },
    methods: {
        clearCanvas() { this.ctx.clearRect(0, 0, this.width + 2, this.height + 2) },
        clearCell(x, y) { this.ctx.clearRect(x * this.subSize + 1, y * this.subSize + 1, this.subSize - 1, this.subSize - 1) },
        drawGrid() {
            this.ctx.fillStyle = "#2B2B2B"
            for (let i = 0; i < this.width + 1; i += this.subSize) this.ctx.fillRect(Math.floor(i), 0, 1, this.height)
            for (let i = 0; i < this.height + 1; i += this.subSize) this.ctx.fillRect(0, Math.floor(i), this.width, 1)
        },
        fillCell(x, y, percent = 0.5) {
            this.ctx.fillStyle = shadeBlend(percent, '#5a1bd1', '#1bd12d')
            this.ctx.fillRect(x * this.subSize + 1, y * this.subSize + 1, this.subSize - 1, this.subSize - 1)
        },
        drawText(y, percent) {
            // Flip and translate
            this.ctx.rotate(Math.PI)
            this.ctx.translate(-this.width - 1, -this.height - 1)

            this.ctx.clearRect(this.width + 1, this.height * 3, 45 + 2, -this.height * 3)

            // Draw the percentage indicator
            if (!isNaN(100 * percent)) {
                this.ctx.fillStyle = 'white'
                this.ctx.font = '10px Helvetica'
                this.ctx.fillText((100 * percent).toFixed(2) + '%', this.width + 7, y + (percent > 0.9 ? 13 : -1))

                this.ctx.fillStyle = '#2B2B2B'
                this.ctx.fillRect(this.width, y + 2, 41, 1)
            }

            // Flip and translate
            this.ctx.rotate(Math.PI)
            this.ctx.translate(-this.width - 1, -this.height - 1)
        },
        setProgress(animate = false) {
            this.clearCanvas()
            if (!this.$root.job.file.name) return
            this.drawGrid()
            return new Promise(res => {
                // Current cursor position
                var cur = new class {
                    constructor(p) {
                        this.p = p
                        this.x = 0
                        this.y = 0
                        this.max = Math.floor(p.subs.x * p.subs.y * p.completion)
                    }
                    get total() { return this.y * this.p.subs.x + (this.y % 2 !== 0 ? this.p.subs.x - this.x : this.x) }
                    get ratio() { return this.total / this.max }
                }(this)

                // Flash length in ms
                let flashLength = 400

                // Recursive flashing function
                var flashCell = (s = -1) => {
                    // Set flashing flag on initialize
                    if (s < 0) this.flashing = true

                    // Fill cell for flash length
                    if (s > 60 * flashLength / 1000 || this.completion >= 1) this.fillCell(cur.x, cur.y, 1)

                    // Clear cell for flash length
                    else this.clearCell(cur.x, cur.y)

                    // Increment or reset flash counter
                    s = s > 60 * 2 * flashLength / 1000 ? 0 : s + 1

                    // If flashing isnt disabled, recursively call this function
                    if (this.flashing) window.requestAnimationFrame(() => flashCell(s))
                }

                // Recursive cell painting function
                var fillCells = () => {
                    // Fill the current cell
                    this.fillCell(cur.x, cur.y, cur.ratio)

                    // Move cursor to new cell
                    if ((cur.y % 2 && cur.x == 0) || (!(cur.y % 2) && cur.x == this.subs.x)) cur.y++;
                    else if (cur.y % 2 && cur.x > 0) cur.x--;
                    else if (!(cur.y % 2) && cur.x < this.subs.x) cur.x++;

                    this.drawText(this.height - 2 - cur.y * this.subSize, (this.completion * cur.ratio) == NaN ? 0 : (this.completion * cur.ratio))

                    // Recursively call this function
                    if (cur.total < cur.max) animate && cur.x % 2 == 0 ? window.requestAnimationFrame(fillCells) : fillCells()

                    // Flash last cell async and resolve promise
                    else new Promise(() => flashCell()) && res()
                }
                fillCells()
            })
        }
    }
})
