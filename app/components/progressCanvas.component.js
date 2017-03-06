Vue.component('progress-canvas', {
    template: `
    <div class="progress-canvas">
        <canvas ref="can" :height="height+2" :width="width+2"></canvas>
    </div>
    `,
    props: ['current', 'total'],
    data: () => ({ height: 100, width: 100, subSize: 5, flashing: false }),
    computed: {
        subs() { return { x: Math.floor((this.width - 1) / this.subSize), y: Math.floor((this.height - 1) / this.subSize) } },
        completion() { return this.current / this.total }
    },
    mounted() {
        this.ctx = this.$refs.can.getContext('2d')
        this.setProgress(true).then(() => console.log('done'))
        console.log('a')
    },
    methods: {
        clearCanvas() {
            this.ctx.clearRect(0, 0, this.width, this.height)
        },
        drawGrid() {
            for (let i = 0; i < this.width + 1; i += this.subSize) this.ctx.fillRect(Math.floor(i), 0, 1, this.height)
            for (let i = 0; i < this.height + 1; i += this.subSize) this.ctx.fillRect(0, Math.floor(i), this.width, 1)
        },
        fillCell(x, y, percent = 0.5) {
            this.ctx.fillStyle = shadeBlend(percent, '#5a1bd1', '#1bd12d');
            this.ctx.fillRect(x * this.subSize + 1, y * this.subSize + 1, this.subSize - 1, this.subSize - 1)
            this.ctx.fillStyle = "black"
        },
        clearCell(x, y) {
            this.ctx.clearRect(x * this.subSize + 1, y * this.subSize + 1, this.subSize - 1, this.subSize - 1)
        },
        setProgress(animate = false) {
            this.drawGrid()
            return new Promise((res, rej) => {
                // Calculate maximum number of cells
                let maxCells = Math.floor(this.subs.x * this.subs.y * this.current / this.total)

                // Current cursor position
                let current = {
                    x: 0,
                    y: 0,
                    total: () => current.y * this.subs.x + (current.y % 2 ? this.subs.x - current.x : current.x)
                }

                // Flash length in ms
                var flashLength = 400

                // Recursive flashing function
                var flashCell = (x, y, s = -1) => {
                    // Set flashing flag on initialize
                    if (s < 0) this.flashing = true

                    // Fill cell for flash length
                    if (s > (flashLength / 1000) * 60) this.fillCell(x, y, 1)

                    // Clear cell for flash length
                    else this.clearCell(x, y)

                    // Increment or reset flash counter
                    s = s > (flashLength / 1000) * 60 * 2 ? 0 : s + 1

                    // If flashing isnt disabled, recursively call this function
                    if (this.flashing) window.requestAnimationFrame(() => flashCell(x, y, s))
                }

                // Recursive cell painting function
                var fillCells = () => {
                    // Fill the current cell
                    this.fillCell(current.x, current.y, current.total() / maxCells)

                    // Move cursor to new cell
                    if ((current.y % 2 && current.x == 0) || (!(current.y % 2) && current.x == this.subs.x)) current.y++;
                    else if (current.y % 2 && current.x > 0) current.x--;
                    else if (!(current.y % 2) && current.x < this.subs.x) current.x++;

                    // Recursively call this function
                    if (current.total() < maxCells) animate ? window.requestAnimationFrame(fillCells) : fillCells()

                    // Flash last cell async and resolve promise
                    else new Promise(() => flashCell(current.x, current.y)) && res()
                }
                fillCells()
            })
        }
    }
})
