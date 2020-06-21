"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AnimateInstance = _interopRequireDefault(require("./AnimateInstance"));

var _easing = _interopRequireDefault(require("../utile/easing"));

var _css = _interopRequireDefault(require("../utile/css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Animate =
/*#__PURE__*/
function () {
  function Animate() {
    _classCallCheck(this, Animate);

    this.timers = []; // 不同元素对象的动画队列
    // 动画的缓冲函数

    this.easing = _easing["default"]; // 扩展插件

    this.plugins = {};
  } // 判断当前元素是否有动画实例


  _createClass(Animate, [{
    key: "hasAnimate",
    value: function hasAnimate(el) {
      var timers = this.timers;

      for (var i = 0, len = timers.length; i < len; i++) {
        if (timers[i].el === el) {
          return i;
        }
      }

      return false;
    } // 实例化对象入口函数
    // 一个元素对象只能实例化一个AniInstance对象

  }, {
    key: "animate",
    value: function animate(el, config) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var timersIndex = this.hasAnimate(el);

      if (timersIndex === false) {
        return new _AnimateInstance["default"](el, config, callback, this);
      } else {
        //入队操作
        this.timers[timersIndex].animate(config, callback);
      }
    } // 用于扩展插件,只接收json对象

  }, {
    key: "extend",
    value: function extend(plugin) {
      if (Object.prototype.toString.call(plugin) === '[object Object]') {
        for (var i in plugin) {
          if (!this.hasOwnProperty(i)) {
            this[i] = plugin[i];
          } else {
            // 如果属性名称冲突，抛出报错信息
            new Error('Animate already has this attribute ' + i);
          }
        }
      }
    } // 更新动画
    // return 是否完成动画

  }, {
    key: "tick",
    value: function tick(instance) {
      var i = 0,
          val,
          config = instance.curConfig(),
          // 动画相关配置
      easing = this.easing[config.easing],
          // 动画使用的缓存
      el = instance.el,
          // 执行动画的dom元素
      now = Date.now(),
          // 当前时间
      computeVal = config.computeVal,
          // dom属性的增加量
      cur_val = config.cur_val,
          // dom属性的起始值
      percent = (now - config.startTime) / config.duration;
      percent = percent > 1 ? 1 : percent; // 防止溢出

      for (var item in computeVal) {
        // dom属性赋值操作
        // 对象元素予以遍历
        val = cur_val[item] + computeVal[item] * easing.apply(void 0, [percent].concat(_toConsumableArray(config.easingArguments)));
        this.css(el, item, val + config.unit[i]);
        ++i;
      }

      return percent == 1;
    } // 指定间隔执行一次

  }, {
    key: "timer",
    value: function timer() {
      var _this = this;

      return function () {
        var AniInstance; // 动画配置实例
        // 执行动画

        for (var i = 0, len = _this.timers.length; i < len; i++) {
          AniInstance = _this.timers[i]; // 判断动画是否结束, true为结束

          if (_this.tick(AniInstance)) {
            // 执行回调
            var callback = AniInstance.curConfig().hasOwnProperty('callback') ? AniInstance.curConfig().callback : null;

            if (callback) {
              callback(AniInstance.el);
            } // 将动画配置实例退出队列


            if (!AniInstance.dequeue()) {
              // 某个元素的一个动画结束，并且在队列中有下一个动画
              _this.timers.splice(i, 1);

              --len; // 队列长度减一
            }
          }
        }

        if (_this.isFinish()) {
          _this.finish();
        } else {
          _this.interval = requestAnimationFrame(_this.timer());
        }
      };
    } // 开始执行动画

  }, {
    key: "start",
    value: function start() {
      if (!this.interval) {
        this.interval = requestAnimationFrame(this.timer());
      }
    } // 判断动画是否结束

  }, {
    key: "isFinish",
    value: function isFinish() {
      return !this.timers.length;
    } // 结束动画操作

  }, {
    key: "finish",
    value: function finish() {
      var _this = this;

      this.interval = undefined;
      cancelAnimationFrame(_this.interval);
    }
  }]);

  return Animate;
}();

Object.assign(Animate.prototype, _css["default"]);
var _default = Animate;
exports["default"] = _default;