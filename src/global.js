const styleReg = /(\d+)([a-z%]*)/
const separatePI = Math.PI / 2
const bufferReg = /(\w+)\s*(\(?\s*[\d\,\. ]*\)?)/      // 将缓冲函数的参数和函数体分离
// 获取rem的值
const REM = window.getComputedStyle?
            parseInt( window.getComputedStyle( document.body ).fontSize ):
            parseInt( document.body.currentStyle['font-size'] )

// 缓冲函数
const buffers = {
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
            return buffers.bezier3(t, arguments[1], arguments[2])
        } else{
            return buffers.bezier2(t, arguments[1])
        }
    }
}

export {styleReg, separatePI, REM, bufferReg, buffers}