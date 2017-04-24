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
        clearCanvas() { this.ctx.clearRect(0, 0, this.width + 2, this.height + 2) },
        drawTemps() {
            // Clear it
            this.clearCanvas()

            // Store the current highest for a ceiling
            var highest = this.highestTemp()

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

            var gre = 'rgba(27,209,45,';
            var pur = 'rgba(90,27,209,';

            // Run for each tool
            [0, 1].forEach(tool => {
                // Run for setpoint and reading
                ['target', 'actual'].forEach(t => {
                    this.ctx.strokeStyle = `${tool ? pur : gre}${t == 'actual' ? 0.6 : 1.0})`
                    this.ctx.beginPath()
                    for (let i = 0; i < this.$root.temperature.length; i++) {
                        let coord = calc(this.$root.temperature[i])
                        this.ctx[i == 0 ? 'moveTo' : 'lineTo'](coord.x, coord.tools[tool][t])
                    }
                    this.ctx.stroke()
                })
            })
        }
    }
})
