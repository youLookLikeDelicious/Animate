// 缓冲函数
export default {
    liner: function (t) {
        return t;
    },
    swing: function (t) {
        return 0.5 - Math.cos(Math.PI * t) / 2;
    },
    easeIn: function (t) {
        return 1 - t * (1 - t);
    },
    bezier2: function (t, p1) {
        return 1.6 * t - t * t * 0.6
    },
    bezier3: function (t, p1, p2) {
        let restT = 1 - t
        return (3 * (p2 * t + p1 * restT) * restT + t * t) * t
    },
    bezier: function () {
        return arguments.length === 3 ? this.bezier3(...arguments) : this.bezier2(...arguments)
    }
}
