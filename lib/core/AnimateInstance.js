"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _macro = require("../utile/macro");

var _css = _interopRequireDefault(require("../utile/css"));

var _predefindAnimate = _interopRequireDefault(require("../extension/predefind-animate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 默认动画速度,单位毫秒
var speeds = {
  fast: 200,
  slow: 2000,
  _default: 700
}; // 一个元素对象对应的一个或多个动画效果

var AnimateInstance =
/*#__PURE__*/
function () {
  /**
   * @param el 元素对象
   * @param config json
   * @param callback 回调函数
   * @para parent Animate实例
   */
  function AnimateInstance(el, config, callback, parent) {
    _classCallCheck(this, AnimateInstance);

    this.parent = parent;
    this.queue = [];
    this.el = el;
    this.speeds = speeds;
    this.animate(config, callback);
  }
  /**
   * 获取预定义动画的配置
   */


  _createClass(AnimateInstance, [{
    key: "getPreDefineAnimate",
    value: function getPreDefineAnimate(config) {
      if (config.hasOwnProperty('ani')) {
        // 如果没有预定义动画，结束执行
        if (!this[config['ani']]) {
          return;
        }

        var tmpConfig = this[config.ani](this.el);
        Object.assign(config, tmpConfig); // 移除预定于动画属性
        // delete(config.ani)
      }
    }
    /**
     * 用于追加动画，将动画推入到队列中
     * @param config
     * @param duration
     * @param delay 当delay为function类型时，默认没有延时
     * @param callback
     */

  }, {
    key: "animate",
    value: function animate(config, callback) {
      var _this = this,
          _callback = typeof delay === 'function' ? delay : callback;

      this.getPreDefineAnimate(config); // 判断是否延迟处理

      if (typeof config.delay === 'number') {
        window.setTimeout(function () {
          _this.getConfig(config, _callback);
        }, config.delay);
      } else {
        this.getConfig(config, _callback);
      }
    } // 获取当前队列中的元素

  }, {
    key: "curConfig",
    value: function curConfig() {
      return this.queue[1];
    }
    /**
     * 动画入队操作
     * @param item
     * @returns {boolean}
     */

  }, {
    key: "enqueue",
    value: function enqueue(item) {
      var timers = this.parent.timers,
          queue = this.queue;

      if (queue[0] === 'inProgress') {
        queue.push(item);
      } else {
        // 第一次入队操作
        item['startTime'] = Date.now();
        queue.push('inProgress');
        queue.push(item);
        timers.push(this);
        this.parent.start();
      } // 处理延迟回调重新设置动画的情况


      if (this.parent.hasAnimate(this.el) === false) {
        queue[1]['startTime'] = Date.now();
        timers.push(this);
        this.parent.start();
      }

      return true;
    }
    /**
     * 判断动画是否移出队列
     * @return boolean
     */

  }, {
    key: "checkDequeue",
    value: function checkDequeue() {
      if (this.queue[1].times === 'infinite') {
        return false;
      }

      if (!isNaN(this.queue[1].times) && --this.queue[1].times > 0) {
        return false;
      }

      return true;
    }
    /**
     * 动画出队操作
     * @returns {boolean} 如果有后续动画 true, 如果没有后续动画 false,
     */

  }, {
    key: "dequeue",
    value: function dequeue() {
      var queue = this.queue,
          times = queue[1].times; // 不允许出队

      if (!this.checkDequeue()) {
        return false;
      }

      queue.shift();
      queue.shift(); // 设置下一个动画效果的起始时间

      if (queue.length >= 1) {
        queue[0]['startTime'] = Date.now();
      }

      queue.unshift('inProgress');
      return queue.length >= 2;
    }
    /**
     * 获取动画的相关配置
     * @param config
     * @param duration
     * @param callback
     */

  }, {
    key: "getConfig",
    value: function getConfig(config, callback) {
      var i = 0,
          cur,
          tmp = {},
          el = this.el,
          computeVal = {},
          cur_val = {},
          unit = [],
          // 属性的单位
      styles = this.css(el),
          styleStack; // dom属性的配置信息
      // 所传的配置参数必须是json对象，否则不予以处理

      if (Object.prototype.toString.call(config) !== '[object Object]') {
        return;
      } // 获取当前属性的值和总的计算量(目标值-当前值)


      for (var item in config) {
        if (item in styles || item === 'scrollTop') {
          styleStack = isNaN(config[item]) ? config[item].match(_macro.styleReg) : config[item];
          unit.push(styleStack[2] || ''); // 获取属性当前的值

          cur = this.css(el, item); // 如果计算的长度单位是rem，将cur的值转换成rem
          // 相应的，dom元素的属性也应该改变

          if (unit[i] === 'rem') {
            styleStack[1] *= _macro.REM;
            unit[i] = 'px';
          }

          if (styleStack instanceof Array) {
            computeVal[item] = styleStack[1] - cur;
          } else {
            computeVal[item] = styleStack - cur;
          }

          cur_val[item] = cur;
        }

        ++i;
      } // 获取缓冲函数及其参数


      if (config.hasOwnProperty('easing')) {
        var easing = config.easing.match(_macro.easingReg);
        tmp['easing'] = easing[1]; // 提取( 1， 23 )中的参数，保存在数组中

        tmp['easingArguments'] = easing[2].slice(1, -1).replace(' ', '').split(',');
      } else {
        tmp['easing'] = 'bezier';
        tmp['easingArguments'] = [0.8];
      } // 获取动画运行的次数,默认只运行一次


      tmp['times'] = config.hasOwnProperty('times') ? config.times : 1;
      tmp['cur_val'] = cur_val;
      tmp['computeVal'] = computeVal;
      tmp['duration'] = !isNaN(config.duration) ? config.duration : config.duration in this.speeds ? this.speeds[duration] : this.speeds._default;
      tmp['unit'] = unit; // 添加回调函数

      if (typeof callback === 'function') {
        tmp['callback'] = callback;
      } // 动画入队操作


      this.enqueue(tmp); // 结束当前的动画

      if (config.hasOwnProperty('finish') && config.finish === true) {
        // 如果之前有动画，则取消之前的动画，反之不取消
        if (this.queue.length > 2) {
          this.dequeue();
        }
      }
    }
    /**
     * 添加扩展配置（根据指令，自动设置动画配置）
     * @param obj: Object
     */

  }], [{
    key: "extend",
    value: function extend(obj) {
      for (var key in obj) {
        // 如果AnimateInstance已经拥有obj的key值，抛出异常
        if (AnimateInstance.hasOwnProperty(key)) {
          new Error('AnimateInstance already had this propety!');
        }

        AnimateInstance.prototype[key] = obj[key];
      }
    }
  }]);

  return AnimateInstance;
}();

AnimateInstance.extend(_css["default"]);
AnimateInstance.extend(_predefindAnimate["default"]);
var _default = AnimateInstance;
exports["default"] = _default;