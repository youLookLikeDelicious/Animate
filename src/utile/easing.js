// 缓冲函数
const easing = {
    liner: function (t) {
        return t;
    },
    swing:function (t) {
        return 0.5 - Math.cos(Math.PI * t) / 2;
    },
    // sinx 0 ~ PI 之间的面积
    speedDownIn: function (t) {
        return Math.sin(separatePI * t);
    },
    // cos 0 ~ PI 之间的面积
    speedUpIn: function (t) {
        return 1 - Math.cos(separatePI * t);
    },
    easeIn:function (t) {
        return 1 - t * (1 - t);
    },
    bezier2: function (t, p1) {
        return 1.6 * t - t * t * 0.6
    },
    bezier3:function (t, p1, p2) {
        let restT = 1 - t
        return (3 * (p2 * t + p1 * restT) * restT + t * t) * t
    },
    bezier:function (t) {
        return arguments.length === 3 ? easing.bezier3(t, arguments[1], arguments[2]) : easing.bezier2(t, arguments[1])
    }
}

export default easing
