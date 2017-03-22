Vue.component('temperature-canvas', {
    template: `
    <div class="temperature-canvas left" style="position:relative;width:400px;height:55px">
        <div class="temperatures">
            <div v-for="t,k,i in currentTemps" :class="i % 2 ? 'green' : 'purple'" v-if="k!=='ts'">{{k}}: {{t.actual}}/{{t.target}}</div>
        </div>
        <canvas ref="tcan" :width="width" :height="height"></canvas>
    </div>
    `,
    props: ['current', 'total'],
    data: () => ({ height: 55, width: 400 }),
    computed: {
        highestTemp() {
            return this.$root.temperature.reduce((highest, temp) => {
                return Object.keys(temp)
                    .filter(k => k !== 'ts')
                    .map(k => temp[k])
                    .reduce((high, tool) => {
                        let m = Object.values(tool).sort((a, b) => a < b)[0]
                        return m > high ? m : high
                    }, highest)
            }, 0) * 1.10 + 10
        },
        currentTemps() {
            return this.$root.temperature[this.$root.temperature.length - 1]
        }
    },
    mounted() {
        // Set up the canvas
        this.ctx = this.$refs.tcan.getContext('2d')
        this.ctx.lineWidth = 1

        this.$root.$on('polled', () => this.drawTemps())
    },
    methods: {
        clearCanvas() { this.ctx.clearRect(0, 0, this.width + 2, this.height + 2) },
        connectPoints(coord1, coord2, tool) {
            let gre = 'rgba(27,209,45,'
            let pur = 'rgba(90,27,209,'
            let col = tool ? gre : pur

            this.ctx.strokeStyle = col + '1)'
            this.ctx.beginPath()
            this.ctx.moveTo(coord1.x, coord1.tools[tool].actual)
            this.ctx.lineTo(coord2.x, coord2.tools[tool].actual)
            this.ctx.stroke()

            this.ctx.strokeStyle = col + '0.5)'
            this.ctx.beginPath()
            this.ctx.moveTo(coord1.x, coord1.tools[tool].target)
            this.ctx.lineTo(coord2.x, coord2.tools[tool].target)
            this.ctx.stroke()
        },
        drawTemps() {
            Vue.log(this.currentTemps)
            // Clear it
            this.clearCanvas()

            // Store the current highest for a ceiling
            var highest = this.highestTemp

            let calc = t => {
                return {
                    x: Math.round(this.width * (t.ts - (Date.now() / 1000 - 300)) / 300),
                    tools: Object.keys(t).filter(k => k !== 'ts').map(k => t[k]).map(tool => {
                        return {
                            actual: this.height - Math.round(this.height * tool.actual / highest),
                            target: this.height - Math.round(this.height * tool.target / highest),
                        }
                    })
                }
            }

            let coords, oldCoords;

            for (let i = 0; i < this.$root.temperature.length; i++) {
                coords = calc(this.$root.temperature[i])

                if (oldCoords) {
                    for (let j = 0; j < coords.tools.length; j++) this.connectPoints(oldCoords, coords, j)
                }

                oldCoords = coords
            }
        }

    }
})
