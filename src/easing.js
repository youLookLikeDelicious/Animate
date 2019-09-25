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
        let restP = 1 - t,
            result = 1.6 * t - 0.6 * t * t
        return  result
    },
    bezier3:function (t, p1, p2) {
        let restP = 1 - t,
            result = t * t * t + 3.0 * restP * t * (restP * p1 + t * p2)
        return result
    },
    bezier:function (t) {
        if( arguments.length === 3 ){
            return easing.bezier3(t, arguments[1], arguments[2])
        } else{
            return easing.bezier2(t, arguments[1])
        }
    }
}

export default easing