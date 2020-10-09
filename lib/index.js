"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("./utile/compatibility");

var _Animate = _interopRequireDefault(require("./core/Animate"));

var _extends = _interopRequireDefault(require("./extension/extends"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var animate = new _Animate["default"](); // 安装插件

animate.extend({
  bannerFader: function bannerFader(container) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    new _extends["default"](container, config || {}, this);
  }
});

function init() {
  animate.animate.apply(animate, arguments);
}

Object.assign(init, animate);
Object.assign(init, _Animate["default"].prototype);

if (window) {
  window.Animate = init;
}

var _default = init;
exports["default"] = _default;