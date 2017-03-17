//
// Protos
//

String.prototype.capFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

Number.prototype.pad = function(size) {
    var s = String(this)
    while (s.length < (size || 2)) s = '0' + s;
    return s
}

function shadeBlend(p, c0, c1) {
    var n = p < 0 ? p * -1 : p,
        u = Math.round,
        w = parseInt;
    if (c0.length > 7) {
        var f = c0.split(","),
            t = (c1 ? c1 : p < 0 ? "rgb(0,0,0)" : "rgb(255,255,255)").split(","),
            R = w(f[0].slice(4)),
            G = w(f[1]),
            B = w(f[2]);
        return "rgb(" + (u((w(t[0].slice(4)) - R) * n) + R) + "," + (u((w(t[1]) - G) * n) + G) + "," + (u((w(t[2]) - B) * n) + B) + ")"
    } else {
        var f = w(c0.slice(1), 16),
            t = w((c1 ? c1 : p < 0 ? "#000000" : "#FFFFFF").slice(1), 16),
            R1 = f >> 16,
            G1 = f >> 8 & 0x00FF,
            B1 = f & 0x0000FF;
        return "#" + (0x1000000 + (u(((t >> 16) - R1) * n) + R1) * 0x10000 + (u(((t >> 8 & 0x00FF) - G1) * n) + G1) * 0x100 + (u(((t & 0x0000FF) - B1) * n) + B1)).toString(16).slice(1)
    }
}

Vue.log = (...o) => console.log(...(o.map(i => i === undefined ? undefined : JSON.parse(JSON.stringify(i)))))

Wait = ms => new Promise(rs => setTimeout(() => rs(), ms))

Promise.prototype.json = function() {
    return this.then(r => {
        if (!r.ok) throw r.status
        return r.json()
    })
}
