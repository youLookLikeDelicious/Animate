"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// 缓冲函数
var easing = {
  liner: function liner(t) {
    return t;
  },
  swing: function swing(t) {
    return 0.5 - Math.cos(Math.PI * t) / 2;
  },
  // sinx 0 ~ PI 之间的面积
  speedDownIn: function speedDownIn(t) {
    return Math.sin(separatePI * t);
  },
  // cos 0 ~ PI 之间的面积
  speedUpIn: function speedUpIn(t) {
    return 1 - Math.cos(separatePI * t);
  },
  easeIn: function easeIn(t) {
    return 1 - t * (1 - t);
  },
  bezier2: function bezier2(t, p1) {
    return 1.6 * t - t * t * 0.6;
  },
  bezier3: function bezier3(t, p1, p2) {
    var restP = 1 - t;
    return t * t * t + 3.0 * restP * t * (restP * p1 + t * p2);
  },
  bezier: function bezier(t) {
    return arguments.length === 3 ? easing.bezier3(t, arguments[1], arguments[2]) : easing.bezier2(t, arguments[1]);
  }
};
var _default = easing;
exports["default"] = _default;